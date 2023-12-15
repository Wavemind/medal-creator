# Every component of an algorithm
class Node < ApplicationRecord
  READ_ONLY_FIELDS = [:is_neonat, :is_danger_sign, :formula, :round, :is_mandatory, :is_unavailable, :is_estimable,
                      :is_identifiable, :is_referral, :is_pre_fill, :is_default, :min_value_warning, :max_value_warning,
                      :min_value_error, :max_value_error, :min_score, :cut_off_start, :cut_off_end, :is_anti_malarial,
                      :is_antibiotic]
  attr_accessor :cut_off_value_type

  belongs_to :project

  has_many :children
  has_many :answers, foreign_key: 'node_id', dependent: :destroy
  has_many :instances, dependent: :destroy
  has_many :decision_trees # as ComplaintCategory
  has_many :node_exclusions_out, class_name: 'NodeExclusion', foreign_key: 'excluding_node_id', dependent: :destroy
  has_many :node_exclusions_in, class_name: 'NodeExclusion', foreign_key: 'excluded_node_id', dependent: :destroy
  has_many :excluding_nodes, through: :node_exclusions_in, source: :excluding_node
  has_many :excluded_nodes, through: :node_exclusions_out, source: :excluded_node

  has_many_attached :files

  scope :by_types, ->(types) { types.present? ? where(type: types) : self }
  scope :by_neonat, ->(is_neonat) { is_neonat.nil? ? self : where(is_neonat: is_neonat) }

  validates :files, content_type: ['image/png', 'image/jpeg', 'audio/mpeg'], size: { less_than: 10.megabytes }
  validates :label_translations, translated_fields_presence: { project: lambda { |record|
    record.project_id
  } }

  before_create :generate_reference
  validate :check_readonly_fields

  translates :label, :description, :min_message_error, :max_message_error, :min_message_warning, :max_message_warning,
             :placeholder

  # Puts nil instead of empty string when formula is not set in the view.
  nilify_blanks only: [:formula]

  # Return node types that are not in the given diagram
  def self.excluded_categories(diagram)
    if diagram.is_a?(Algorithm)
      %w[Diagnosis HealthCares::Drug HealthCares::Management]
    elsif diagram.is_a?(DecisionTree)
      %w[HealthCares::Drug HealthCares::Management Variables::VitalSignAnthropometric Variables::BasicMeasurement Variables::BasicDemographic Variables::Referral Variables::TreatmentQuestion]
    elsif diagram.is_a?(QuestionsSequences::Scored)
      %w[Diagnosis HealthCares::Drug HealthCares::Management QuestionsSequences::Scored Variables::VitalSignAnthropometric Variables::BasicMeasurement Variables::BasicDemographic Variables::Referral]
    elsif diagram.is_a?(QuestionsSequence)
      %w[Diagnosis HealthCares::Drug HealthCares::Management Variables::VitalSignAnthropometric Variables::BasicMeasurement Variables::BasicDemographic Variables::Referral]
    elsif diagram.is_a?(Diagnosis)
      %w[Diagnosis Variables::VitalSignAnthropometric Variables::BasicMeasurement Variables::BasicDemographic Variables::Referral]
    else
      []
    end
  end

  # Return node types that are present in the given diagram (based on the excluded categories)
  def self.included_categories(diagram)
    Variable.descendants.map(&:name) + QuestionsSequence.descendants.map(&:name) + %w[Diagnosis HealthCares::Drug HealthCares::Management] - Node.excluded_categories(diagram)
  end

  # From a grand child of Node, reconstruct whole name
  def self.reconstruct_class_name(name)
    question_sequences = QuestionsSequence.descendants.map(&:name).map{|name| name.gsub(/^[^:]+::/, '')}
    variables = Variable.descendants.map(&:name).map{|name| name.gsub(/^[^:]+::/, '')}

    if %w[Drug Management].include?(name)
      "HealthCares::#{name}"
    elsif question_sequences.include?(name)
      "QuestionsSequences::#{name}"
    elsif variables.include?(name)
      "Variables::#{name}"
    else
      name
    end
  end

  # Search by label (hstore) for the project language
  def self.search(term, language)
    where('nodes.label_translations -> :l ILIKE :search', l: language, search: "%#{term}%").distinct
  end

  # Get translatable attributes
  def self.translatable_params
    %w[label description]
  end

  # Get all algorithms where the node is instantiated in
  def algorithms_instantiated_in(algorithms = [])
    instances.includes(:instanceable).each do |instance|
      if instance.instanceable_type == 'Algorithm'
        algorithms.push(instance.instanceable_id)
      elsif instance.instanceable_type == 'DecisionTree'
        algorithms.push(instance.instanceable.algorithm_id)
      elsif instance.instanceable_type == 'Node'
        algorithms = instance.instanceable.algorithms_instantiated_in(algorithms) unless instance.node_id == instance.instanceable_id
      end
    end
    algorithms.uniq
  end

  # Return the final type of node -> physical_exam, predefined_syndrome, drug, ...
  def category_name
    if self.is_a?(QuestionsSequence) || self.is_a?(Variable) || self.is_a?(HealthCare)
      self.variable_type
    end
  end

  # @return [JSON]
  # Return answers if any
  def diagram_answers
    defined?(answers) ? answers : []
  end

  # @return [ActiveRecord::Association]
  # List of instances
  def dependencies
    instances.includes([:instanceable]).where.not(instanceable_type: 'Algorithm')
  end

  # Return dependencies for a variable scoped by one algorithm
  def dependencies_for_one_algorithm(algorithm_id)
    instances.includes([:instanceable]).where.not(instanceable_type: 'Node').select do |instance|
      if instance.instanceable_type == 'DecisionTree'
        instance.instanceable.algorithm_id == algorithm_id
      else
        true
      end
    end
  end

  # Return dependencies separated by algorithm for display
  def dependencies_by_algorithm(language = 'en')
    hash = {}
    qss = []
    instances.includes([:instanceable]).each do |i|
      if i.instanceable_type == 'DecisionTree'
        algorithm = i.instanceable.algorithm
        if hash[algorithm.id].nil?
          hash[algorithm.id] = {}
          hash[algorithm.id][:title] = algorithm.name
          hash[algorithm.id][:dependencies] = []
        end

        if i.diagnosis_id.present?
          instance_hash = {label: i.diagnosis.reference_label(language), id: i.diagnosis_id, type: 'Diagnosis'}
        else
          instance_hash = {label: i.instanceable.reference_label(language), id: i.instanceable_id, type: 'DecisionTree'}
        end
        hash[algorithm.id][:dependencies].push(instance_hash)
      elsif i.instanceable_type == 'Node'
        qss.push({label: i.instanceable.reference_label(language), id: i.instanceable_id, type: 'QuestionsSequence'})
      elsif i.instanceable_type == 'Algorithm'
        if hash[i.instanceable_id].nil?
          hash[i.instanceable_id] = {}
          hash[i.instanceable_id][:title] = i.instanceable.name
          hash[i.instanceable_id][:dependencies] = []
        end
        hash[i.instanceable_id][:dependencies].unshift({label: I18n.t('nodes.used_in_algorithm_diagram'), id: i.instanceable_id, type: i.instanceable_type})
      end
    end

    if qss.any?
      hash[:qs] = {}
      hash[:qs][:title] = I18n.t('nodes.questions_sequences')
      hash[:qs][:dependencies] = qss
    end

    if decision_trees.any?
      hash[:dd] = {}
      hash[:dd][:title] = I18n.t('nodes.conditioning_title')
      hash[:dd][:dependencies] = decision_trees.map {|d| {label: d.reference_label(language), id: d.id, type: 'DecisionTree'}}
    end
    hash
  end

  # Return reference with its prefix
  def full_reference
    reference_prefix + reference.to_s
  end

  # Check amongst the algorithms the node is in if they all are in draft or if any is archived/in prod
  def is_deployed?
    algorithms = Algorithm.where(id: algorithms_instantiated_in)
    return false unless algorithms.any?
    !algorithms.all?(&:draft?)
  end

  # Return the parent type of node -> Diagnosis/Variable/QuestionsSequence/HealthCare
  def node_type
    self.is_a?(Diagnosis) ? self.class.name : self.class.superclass.name
  end

  # @return [String]
  # Return the label with the reference for the view
  def reference_label(language = 'en')
    "#{full_reference} - #{self.send("label_#{language}")}"
  end

  def variable_type
    type.underscore.split("/").last
  end

  private

  # Ensure fields that should be readonly are not changed
  def check_readonly_fields
    if is_deployed?
      READ_ONLY_FIELDS.each do |field|
        errors.add(field, I18n.t('activerecord.errors.nodes.readonly', field: field)) if send("#{field}_changed?")
      end
    end
  end

  # Automatically create the answers, since they can't be changed
  # Create 2 automatic answers (yes & no) for PS and boolean questions
  def create_boolean
    self.answers << Answer.new(reference: 1, label_translations: Hash[Language.all.map(&:code).collect { |k| [k, I18n.t('answers.predefined.yes', locale: k)] } ])
    self.answers << Answer.new(reference: 2, label_translations: Hash[Language.all.map(&:code).collect { |k| [k, I18n.t('answers.predefined.no', locale: k)] } ])
    self.save
  end

  # Generate the reference automatically using the type
  def generate_reference
    self.reference = (project.nodes.where(type: type).maximum(:reference) || 0) + 1
  end
end

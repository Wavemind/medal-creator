# Every component of an algorithm
class Node < ApplicationRecord
  attr_accessor :cut_off_value_type

  belongs_to :project

  has_many :children
  has_many :instances, dependent: :destroy
  has_many :decision_trees # as ComplaintCategory
  has_many :node_exclusions_out, class_name: 'NodeExclusion', foreign_key: 'excluding_node_id', dependent: :destroy
  has_many :node_exclusions_in, class_name: 'NodeExclusion', foreign_key: 'excluded_node_id', dependent: :destroy
  has_many :excluding_nodes, through: :node_exclusions_in, source: :excluding_node
  has_many :excluded_nodes, through: :node_exclusions_out, source: :excluded_node

  has_many_attached :files

  scope :by_types, ->(types) { types.present? ? where(type: types) : self }
  scope :by_neonat, ->(is_neonat) { is_neonat.present? ? where(is_neonat: is_neonat) : self }

  validates :files, content_type: ['image/png', 'image/jpeg', 'audio/mpeg'], size: { less_than: 10.megabytes }
  validates :label_translations, translated_fields_presence: { project: lambda { |record|
    record.project_id
  } }

  after_create :generate_reference

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

  # Search by label (hstore) for the project language
  def self.search(term, language)
    where('nodes.label_translations -> :l ILIKE :search', l: language, search: "%#{term}%").distinct
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

  # Return dependencies separated by version for display
  def dependencies_by_algorithm(language = 'en')
    hash = {}
    qss = []
    dependencies.each do |i|
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
          hash[i.instanceable_id][:title] = algorithm.name
          hash[i.instanceable_id][:dependencies] = []
        end
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

  # @return [String]
  # Return the label with the reference for the view
  def reference_label(language = 'en')
    "#{full_reference} - #{self.send("label_#{language}")}"
  end

  private

  # Automatically create the answers, since they can't be changed
  # Create 2 automatic answers (yes & no) for PS and boolean questions
  def create_boolean
    self.answers << Answer.new(reference: 1, label_translations: Hash[Language.all.map(&:code).unshift('en').collect { |k| [k, I18n.t('answers.predefined.yes', locale: k)] } ])
    self.answers << Answer.new(reference: 2, label_translations: Hash[Language.all.map(&:code).unshift('en').collect { |k| [k, I18n.t('answers.predefined.no', locale: k)] } ])
    self.save
  end

  # Generate the reference automatically using the type
  def generate_reference
    if project.nodes.where(type: type).count > 1
      self.reference = project.nodes.where(type: type).maximum(:reference) + 1
    else
      self.reference = 1
    end
    self.save
  end
end

# Every component of an algorithm
class Node < ApplicationRecord
  attr_accessor :cut_off_value_type

  belongs_to :project

  has_many :children
  has_many :instances, dependent: :destroy
  has_many :decision_trees # as ComplaintCategory
  has_many :node_exclusions, foreign_key: 'excluding_node_id', dependent: :destroy

  has_many_attached :files

  validates :files, content_type: ['image/png', 'image/jpeg', 'audio/mpeg'], size: { less_than: 10.megabytes }
  validates_presence_of :label_translations
  validates :label_translations, translated_fields_presence: { project: lambda { |record|
    record.project_id
  } }

  translates :label, :description, :min_message_error, :max_message_error, :min_message_warning, :max_message_warning,
             :placeholder

  # Puts nil instead of empty string when formula is not set in the view.
  nilify_blanks only: [:formula]

  # Search by label (hstore) for the project language
  def self.search(term, language)
    where(
      'nodes.label_translations -> :l ILIKE :search', l: language, search: "%#{term}%"
    ).distinct
  end

  # @return [ActiveRecord::Association]
  # List of instances
  def dependencies
    instances.includes(:instanceable, :diagnosis).where.not(instanceable_type: 'Algorithm')
  end

  def dependencies_for_one_algorithm(algorithm_id)
    instances.includes(:instanceable, :diagnosis).select do |instance|
      if instance.instanceable_type == 'DecisionTree'
        instance.instanceable.algorithm_id = algorithm_id
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
end

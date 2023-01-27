# Exclusion between two nodes
class NodeExclusion < ApplicationRecord
  enum node_type: %i[drug diagnosis management]

  belongs_to :excluding_node, class_name: 'Node'
  belongs_to :excluded_node, class_name: 'Node'

  validates :excluded_node_id,
            uniqueness: { scope: :excluding_node_id, message: I18n.t('errors.final_diagnosis_exclusion_unique') }
end

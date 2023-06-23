# Exclusion between two nodes
class NodeExclusion < ApplicationRecord
  enum node_type: %i[drug diagnosis management]

  belongs_to :excluding_node, class_name: 'Node'
  belongs_to :excluded_node, class_name: 'Node'

  validates :excluded_node_id,
            uniqueness: { scope: :excluding_node_id, message: I18n.t('activerecord.errors.node_exclusions.unique') }

  after_validation :prevent_loop
  after_validation :validates_type

  private

  # Recursive loop to make sure it is not excluding a grand child of excluded diagnosis
  def is_excluding_itself(node_id)
    NodeExclusion.where(excluding_node_id: node_id).map do |exclusion|
      return true if exclusion.excluded_node_id == excluding_node_id || is_excluding_itself(exclusion.excluded_node_id)
    end
    false
  end

  # Ensure that the user is not trying to loop with excluding diagnoses.
  def prevent_loop
    if excluding_node_id == excluded_node_id || is_excluding_itself(excluded_node_id)
      self.errors.add(:base, I18n.t('activerecord.errors.node_exclusions.loop'))
    end
  end

  # Ensure that both excluding and excluded nodes are typed the same as the exclusion
  def validates_type
    if drug?
      self.errors.add(:excluding_node_id, I18n.t('activerecord.errors.node_exclusions.wrong_type')) unless excluding_node.is_a?(HealthCares::Drug)
      self.errors.add(:excluded_node_id, I18n.t('activerecord.errors.node_exclusions.wrong_type')) unless excluding_node.is_a?(HealthCares::Drug)
    elsif management?
      self.errors.add(:excluding_node_id, I18n.t('activerecord.errors.node_exclusions.wrong_type')) unless excluding_node.is_a?(HealthCares::Management)
      self.errors.add(:excluded_node_id, I18n.t('activerecord.errors.node_exclusions.wrong_type')) unless excluding_node.is_a?(HealthCares::Management)
    elsif diagnosis?
      self.errors.add(:excluding_node_id, I18n.t('activerecord.errors.node_exclusions.wrong_type')) unless excluding_node.is_a?(Diagnosis)
      self.errors.add(:excluded_node_id, I18n.t('activerecord.errors.node_exclusions.wrong_type')) unless excluding_node.is_a?(Diagnosis)
    end
  end
end

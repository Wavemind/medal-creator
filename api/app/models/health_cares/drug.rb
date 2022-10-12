# Define every drugs for a diagnosis
# Reference prefix : DR
class HealthCares::Drug < HealthCare

  has_many :formulations, foreign_key: 'node_id', dependent: :destroy

  accepts_nested_attributes_for :formulations, allow_destroy: true

  def self.policy_class
    DrugPolicy
  end

end

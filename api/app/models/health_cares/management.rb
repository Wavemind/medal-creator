# Define every managements for a diagnosis
# Reference prefix : M
class HealthCares::Management < HealthCare

  def self.policy_class
    ManagementPolicy
  end

end

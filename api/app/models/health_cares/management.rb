# Define every managements for a diagnosis
# Reference prefix : M
class HealthCares::Management < HealthCare
  def self.policy_class
    ManagementPolicy
  end

  def self.variable
    'management'
  end

  private

  def reference_prefix
    I18n.t("managements.reference")
  end
end

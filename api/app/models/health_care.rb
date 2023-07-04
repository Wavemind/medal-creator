# Define every drugs for a diagnosis
class HealthCare < Node
  scope :managements, -> { where('type = ?', 'HealthCares::Management') }
  scope :drugs, -> { where('type = ?', 'HealthCares::Drug') }

  validates :level_of_urgency,
            numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 10 }

  private

  def self.variable

  end
end

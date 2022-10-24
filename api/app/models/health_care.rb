# Define every drugs for a diagnosis
class HealthCare < Node

  scope :managements, ->() { where('type = ?', 'HealthCares::Management') }
  scope :drugs, ->() { where('type = ?', 'HealthCares::Drug') }

end

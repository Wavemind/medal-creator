# Define the possible administration routes for a treatment
class AdministrationRoute < ApplicationRecord
  has_many :formulations

  translates :name
end

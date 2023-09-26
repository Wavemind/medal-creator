module Types
  class ValidateType < Types::BaseObject
    field :errors, [String], null: false
    field :warnings, [String], null: false
  end
end

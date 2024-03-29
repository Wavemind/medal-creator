module Types
  class MedalDataConfigVariableType < Types::BaseObject
    field :variable, Types::VariableType, null: false
    field :label, String, null: false
    field :api_key, String, null: false
  end
end

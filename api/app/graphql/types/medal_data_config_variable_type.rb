module Types
  class MedalDataConfigVariableType < Types::BaseObject
    field :algorithm, Types::AlgorithmType
    field :variable, Types::VariableType
    field :label, String
    field :api_key, String
  end
end

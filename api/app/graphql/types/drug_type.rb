module Types
  class DrugType < Types::NodeType
    field :is_anti_malarial, Boolean
    field :is_antibiotic, Boolean
    field :level_of_urgency, Integer
    field :formulations, [Types::FormulationType]
  end
end

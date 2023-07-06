module Types
  class DrugType < Types::NodeType
    field :is_anti_malarial, Boolean, null: false
    field :is_antibiotic, Boolean, null: false
    field :level_of_urgency, Integer, null: false
    field :formulations, [Types::FormulationType], null: false
  end
end

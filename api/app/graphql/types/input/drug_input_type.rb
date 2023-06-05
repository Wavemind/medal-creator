module Types
  module Input
    class DrugInputType < Types::Input::NodeInputType
      argument :level_of_urgency, Integer, required: false
      argument :is_anti_malarial, Boolean, required: true
      argument :is_antibiotic, Boolean, required: true
      argument :formulations, [Types::FormulationType], required: true
    end
  end
end

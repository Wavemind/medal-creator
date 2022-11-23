module Types
  module Input
    class DrugInputType < Types::Input::NodeInputType
      argument :is_anti_malarial, Boolean, required: false
      argument :is_antibiotic, Boolean, required: false
      argument :level_of_urgency, Integer, required: false
      argument :formulations, [Types::FormulationType], required: false
    end
  end
end

module Types
  module Input
    class DiagnosisInputType < Types::Input::NodeInputType
      argument :level_of_urgency, Integer, required: false
      argument :decision_tree_id, ID, required: false
    end
  end
end

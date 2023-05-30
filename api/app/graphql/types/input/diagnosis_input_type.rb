module Types
  module Input
    class DiagnosisInputType < Types::Input::NodeInputType
      argument :decision_tree_id, ID, required: true
      argument :level_of_urgency, Integer, required: false
    end
  end
end

module Types
  module Input
    class ConditionInputType < Types::BaseInputObject
      argument :answer_id, ID, required: false
      argument :instance_id, ID, required: false
      argument :cut_off_start, Integer, required: false
      argument :cut_off_end, Integer, required: false
      argument :score, Integer, required: false
    end
  end
end

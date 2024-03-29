module Types
  module Input
    class QuestionsSequenceInputType < Types::Input::NodeInputType
      argument :type, Types::Enum::QuestionsSequenceCategoryEnum, required: true
      argument :complaint_category_ids, [ID], required: false
      argument :cut_off_value_type, String, required: false
      argument :cut_off_start, Integer, required: false
      argument :cut_off_end, Integer, required: false
      argument :min_score, Integer, required: false
    end
  end
end

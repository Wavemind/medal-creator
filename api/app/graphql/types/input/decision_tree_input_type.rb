module Types
  module Input
    class DecisionTreeInputType < Types::BaseInputObject
      argument :node_id, ID, required: false
      argument :label_translations, Types::Input::HstoreInputType, required: false
      argument :cut_off_start, Integer, required: false
      argument :cut_off_end, Integer, required: false
      argument :cut_off_value_type, String, required: false
      argument :algorithm_id, ID, required: false
    end
  end
end

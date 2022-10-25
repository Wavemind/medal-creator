module Types
  module Input
    class NodeInputType < Types::BaseInputObject
      argument :reference, Integer, required: false
      argument :label_translations, Types::HstoreType, required: false
      argument :description_translations, Types::HstoreType, required: false
      argument :is_neonat, Boolean, required: false
      argument :is_danger_sign, Boolean, required: false
    end
  end
end
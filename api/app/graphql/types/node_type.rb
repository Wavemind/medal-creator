module Types
  class NodeType < Types::BaseObject
    field :reference, Integer
    field :label_translations, Types::HstoreType
    field :description_translations, Types::HstoreType
    field :is_neonat, Boolean
    field :is_danger_sign, Boolean
    field :instances, [Types::InstanceType]
  end
end
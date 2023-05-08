module Types
  class NodeType < Types::BaseObject
    field :reference, Integer
    field :label_translations, Types::HstoreType
    field :description_translations, Types::HstoreType
    field :is_neonat, Boolean
    field :is_danger_sign, Boolean
    field :instances, [Types::InstanceType]
    field :files, [Types::FileType], null: false
    field :type, String
    field :has_instances, Boolean

    def files
      object.files.attached? ? object.files : []
    end

    def has_instances
      object.instances.any?
    end
  end
end

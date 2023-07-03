module Types
  class NodeType < Types::BaseObject
    field :category, String, null: false
    field :reference, Integer, null: false
    field :label_translations, Types::HstoreType, null: false
    field :description_translations, Types::HstoreType
    field :is_neonat, Boolean, null: false
    field :is_danger_sign, Boolean, null: false
    field :instances, [Types::InstanceType], null: false
    field :files, [Types::FileType], null: false
    field :is_default, Boolean, null: false
    field :has_instances, Boolean
    field :diagram_answers, [Types::AnswerType]
    field :excluding_nodes, [Types::NodeType]
    field :excluded_nodes, [Types::NodeType]

    def category
      object.type.split('::').last
    end

    def files
      object.files.attached? ? object.files : []
    end

    def has_instances
      object.instances.any?
    end
  end
end

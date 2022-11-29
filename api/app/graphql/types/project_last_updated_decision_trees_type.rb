module Types
  class ProjectLastUpdatedDecisionTreesType < Types::BaseObject
    field :label, String, null: false
    field :algorithm_name, String, null: false

    # TODO : Check if this really needs to be paginated or not
    # If so, add complaint category label and updatedAt
    def label
      object.label_translations['en']
    end

    def algorithm_name
      object.algorithm.name
    end
  end
end

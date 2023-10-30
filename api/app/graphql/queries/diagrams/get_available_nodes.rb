module Queries
  module Diagrams
    class GetAvailableNodes < Queries::BaseQuery
      type Types::NodeType.connection_type, null: false

      argument :instanceable_id, ID
      argument :instanceable_type, Types::Enum::DiagramEnum # Can be Algorithm, DecisionTree or Node (for Diagnosis and QuestionsSequence)
      argument :search_term, String, required: false
      argument :filters, Types::Input::Filter::NodeFilterInputType, required: false

      # Works with current_user
      def authorized?(instanceable_id:, instanceable_type:, search_term: '', filters: {})
        diagram = Object.const_get(instanceable_type).find(instanceable_id)

        project_id = diagram.is_a?(DecisionTree) ? diagram.algorithm.project_id : diagram.project_id

        return true if context[:current_api_v2_user].has_access_to_project?(project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.record.class))
      end

      def resolve(instanceable_id:, instanceable_type:, search_term: '', filters: {})
        diagram = Object.const_get(instanceable_type).find(instanceable_id)

        if search_term.present?
          project_id = diagram.is_a?(DecisionTree) ? diagram.algorithm.project_id : diagram.project_id
          project = Project.find(project_id)
          available_nodes = diagram.available_nodes.includes(:answers, :excluding_nodes).search(search_term, project.language.code)
        else
          available_nodes = diagram.available_nodes.includes(:answers, :excluding_nodes)
        end

        filters = Hash(filters)
        filters[:types] = filters[:types].map do |type|
          Node.reconstruct_class_name(type)
        end if filters[:types].present?
        available_nodes = available_nodes.by_types(filters[:types])
        available_nodes.by_neonat(filters[:is_neonat])
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.record.class))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

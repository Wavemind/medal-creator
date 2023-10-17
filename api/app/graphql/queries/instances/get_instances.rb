module Queries
  module Instances
    class GetInstances < Queries::BaseQuery
      type [Types::InstanceType], null: false

      argument :node_id, ID, required: true
      argument :algorithm_id, ID, required: false

      # Works with current_user
      def authorized?(node_id:, algorithm_id: nil)
        node = Node.find(node_id)

        return true if context[:current_api_v2_user].has_access_to_project?(node.project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.admin_needed')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      def resolve(node_id:, algorithm_id: nil)
        node = Node.find(node_id)
        if algorithm_id.present?
          node.dependencies_for_one_algorithm(algorithm_id.to_i)
        else
          node.dependencies
        end
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

module Mutations
  module NodeExclusions
    class DestroyNodeExclusion < Mutations::BaseMutation
      # Fields
      field :id, ID, null: true

      # Arguments
      argument :excluding_node_id, ID, required: true
      argument :excluded_node_id, ID, required: true

      # Works with current_user
      def authorized?(excluding_node_id:, excluded_node_id:)
        excluding_node = Node.find(excluding_node_id)
        excluded_node = Node.find(excluded_node_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_node') if excluding_node.is_deployed? || excluded_node.is_deployed?
        
        return true if context[:current_api_v2_user].project_clinician?(excluding_node.project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      # Resolve
      def resolve(excluding_node_id:, excluded_node_id:)
        node_exclusion = NodeExclusion.find_by!(excluding_node_id: excluding_node_id, excluded_node_id: excluded_node_id)
        if node_exclusion.destroy
          { id: node_exclusion.id }
        else
          GraphQL::ExecutionError.new(node_exclusion.errors.to_json)
        end
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

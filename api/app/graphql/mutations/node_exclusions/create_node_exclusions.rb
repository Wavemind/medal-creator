module Mutations
  module NodeExclusions
    class CreateNodeExclusions < Mutations::BaseMutation
      # Fields
      field :node_exclusions, [Types::NodeExclusionType], null: true

      # Arguments
      argument :params, [Types::Input::NodeExclusionInputType], required: true

      # Works with current_user
      def authorized?(params:)
        node = Node.find(params[0][:excluding_node_id])
        return true if context[:current_api_v1_user].clinician? || context[:current_api_v1_user].user_projects.where(
          project_id: node.project_id, is_admin: true
        ).any?

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      # Resolve
      def resolve(params:)
        node_exclusions_params = params.map{|param| Hash(param)}
        begin
          node_exclusions = NodeExclusion.create(node_exclusions_params)
          if node_exclusions.all?(&:valid?)
            { node_exclusions: node_exclusions }
          else
            raise GraphQL::ExecutionError.new(node_exclusions.map(&:errors).to_json)
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.to_json)
        end
      end
    end
  end
end

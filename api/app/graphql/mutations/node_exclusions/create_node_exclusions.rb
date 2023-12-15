module Mutations
  module NodeExclusions
    class CreateNodeExclusions < Mutations::BaseMutation
      # Fields
      field :node_exclusions, [Types::NodeExclusionType], null: true

      # Arguments
      argument :params, [Types::Input::NodeExclusionInputType], required: true

      # Works with current_user
      def authorized?(params:)
        project_id = Node.find(params[0][:excluding_node_id]).project_id

        params.each do |exclusion|
          excluding_node = Node.find(exclusion[:excluding_node_id])
          excluded_node = Node.find(exclusion[:excluded_node_id])

          raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_node') if excluding_node.is_deployed? || excluded_node.is_deployed?
        end

        return true if context[:current_api_v2_user].project_clinician?(project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      # Resolve
      def resolve(params:)
        ActiveRecord::Base.transaction(requires_new: true) do
          node_exclusions_params = params.map { |param| Hash(param) }
          begin
            if (node_exclusions = NodeExclusion.create(node_exclusions_params)) && node_exclusions.all?(&:valid?)
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
end

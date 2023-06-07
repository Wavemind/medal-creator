module Mutations
  module QuestionsSequences
    class CreateQuestionsSequence < Mutations::BaseMutation
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
        node_exclusions_params = Hash params
        begin
          if NodeExclusion.create(node_exclusions_params)
            { }
          else
            GraphQL::ExecutionError.new(questions_sequence.errors.to_json)
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.to_json)
        end
      end
    end
  end
end

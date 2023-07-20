module Mutations
  module QuestionsSequences
    class DestroyQuestionsSequence < Mutations::BaseMutation
      # Fields
      field :id, ID, null: true

      # Arguments
      argument :id, ID, required: true

      # Works with current_user
      def authorized?(id:)
        questions_sequence = QuestionsSequence.find(id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.questions_sequences.has_instances') if questions_sequence.instances.any?

        return true if context[:current_api_v1_user].clinician? || context[:current_api_v1_user].user_projects.where(
          project_id: questions_sequence.project_id, is_admin: true
        ).any?

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'QuestionsSequence')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      # Resolve
      def resolve(id:)
        questions_sequence = QuestionsSequence.find(id)
        if questions_sequence.destroy
          { id: id }
        else
          GraphQL::ExecutionError.new(questions_sequence.errors.to_json)
        end
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

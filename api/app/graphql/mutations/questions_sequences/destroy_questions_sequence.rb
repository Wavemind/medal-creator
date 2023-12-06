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

        # Do not allow destroying if the node has instances. Exception for questions sequences when the instance is self in its own diagram
        raise GraphQL::ExecutionError, I18n.t('graphql.errors.questions_sequences.has_instances') if questions_sequence.instances.where.not(instanceable: questions_sequence).any?

        return true if context[:current_api_v2_user].project_clinician?(questions_sequence.project_id)

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

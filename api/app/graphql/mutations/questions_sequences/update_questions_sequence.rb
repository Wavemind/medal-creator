module Mutations
  module QuestionsSequences
    class UpdateQuestionsSequence < Mutations::BaseMutation
      # Fields
      field :questions_sequence, Types::QuestionsSequenceType

      # Arguments
      argument :params, Types::Input::QuestionsSequenceInputType, required: true

      # Works with current_user
      def authorized?(params:)
        questions_sequence = QuestionsSequence.find(Hash(params)[:id])

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_node') if questions_sequence.is_deployed?

        return true if context[:current_api_v2_user].project_clinician?(questions_sequence.project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      # Resolve
      def resolve(params:)
        questions_sequence_params = Hash params
        begin
          questions_sequence = QuestionsSequence.find(questions_sequence_params[:id])
          if questions_sequence.update!(questions_sequence_params)
            { questions_sequence: questions_sequence }
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

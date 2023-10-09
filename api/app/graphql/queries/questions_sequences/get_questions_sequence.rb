module Queries
  module QuestionsSequences
    class GetQuestionsSequence < Queries::BaseQuery
      type Types::QuestionsSequenceType, null: false
      argument :id, ID

      # Works with current_user
      def authorized?(id:)
        questions_sequence = QuestionsSequence.find(id)

        if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(project_id: questions_sequence.project_id).any?
          return true
        end

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'QuestionsSequence')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      def resolve(id:)
        QuestionsSequence.find(id)
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

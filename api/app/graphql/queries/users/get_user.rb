module Queries
  module Users
    class GetUser < Queries::BaseQuery
      type Types::UserType, null: false
      argument :id, ID

      def resolve(id:)
        User.find(id)
      rescue ActiveRecord::RecordNotFound => _e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: _e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
      end
    end
  end
end

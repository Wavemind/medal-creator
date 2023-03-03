module Mutations
  module TwoFactor
    class Disable2fa < Mutations::BaseMutation
      # Fields
      field :id, ID, null: true

      # Arguments
      argument :params, Types::Input::TwoFaInputType, required: true

      # Works with current_user
      def authorized?(params:)
        user_id = Hash(params)[:user_id]
        return true if context[:current_api_v1_user].admin? || context[:current_api_v1_user].id == user_id.to_i

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.admin_needed')
      end

      # Resolve
      def resolve(params:)
        two_fa_params = Hash params
        begin
          user = User.find(two_fa_params[:user_id])
          if user.disable_two_factor!
            { id: user.id }
          else
            puts user.errors
            raise GraphQL::ExecutionError, "Could not disable 2fa"
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
        end
      end
    end
  end
end

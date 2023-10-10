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
        return true if context[:current_api_v2_user].id == user_id.to_i

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.admin_needed')
      end

      # Resolve
      def resolve(params:)
        two_fa_params = Hash params
        begin
          user = User.find(two_fa_params[:user_id])
          raise GraphQL::ExecutionError, I18n.t('errors.messages.could_not_disable_2fa') unless user.disable_two_factor!

          { id: user.id }
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.to_json)
        end
      end
    end
  end
end

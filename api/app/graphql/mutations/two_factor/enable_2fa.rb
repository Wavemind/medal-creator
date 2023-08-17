module Mutations
  module TwoFactor
    class Enable2fa < Mutations::BaseMutation
      # Fields
      field :id, ID, null: false

      # Arguments
      argument :params, Types::Input::TwoFaInputType, required: true

      # Works with current_user
      def authorized?(params:)
        user_id = Hash(params)[:user_id]
        return true if context[:current_api_v1_user].id == user_id.to_i

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.admin_needed')
      end

      # Resolve
      def resolve(params:)
        two_fa_params = Hash params
        begin
          user = User.find(two_fa_params[:user_id])

          unless user.valid_password?(two_fa_params[:password])
            raise GraphQL::ExecutionError,
                  I18n.t('devise.session.incorrect_password')
          end

          unless user.validate_and_consume_otp!(two_fa_params[:code])
            raise GraphQL::ExecutionError, I18n.t('devise.session.incorrect_otp')
          end

          if user.enable_two_factor!
            { id: user.id }
          else
            I18n.t('errors.messages.could_not_enable_2fa')
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.to_json)
        end
      end
    end
  end
end

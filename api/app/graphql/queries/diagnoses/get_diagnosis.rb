module Queries
  module Diagnoses
    class GetDiagnosis < Queries::BaseQuery
      type Types::DiagnosisType, null: false
      argument :id, ID

      # Works with current_user
      def authorized?(id:)
        diagnosis = Diagnosis.find(id)
        return true if context[:current_api_v2_user].has_access_to_project?(diagnosis.project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Diagnosis')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      def resolve(id:)
        Diagnosis.find(id)
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

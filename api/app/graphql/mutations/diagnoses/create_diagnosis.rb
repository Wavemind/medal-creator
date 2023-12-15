module Mutations
  module Diagnoses
    class CreateDiagnosis < Mutations::BaseMutation
      # Fields
      field :instance, Types::InstanceType

      # Arguments
      argument :params, Types::Input::DiagnosisInputType, required: true
      argument :files, [ApolloUploadServer::Upload], required: false

      # Works with current_user
      def authorized?(params:, files:)
        decision_tree = DecisionTree.find(Hash(params)[:decision_tree_id])
        algorithm = decision_tree.algorithm

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_algorithm', status: algorithm.status) unless algorithm.draft?

        return true if context[:current_api_v2_user].project_clinician?(decision_tree.algorithm.project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      # Resolve
      def resolve(params:, files:)
        diagnosis_params = Hash params
        ActiveRecord::Base.transaction(requires_new: true) do
          begin
            diagnosis = Diagnosis.new(diagnosis_params)
            if diagnosis.save
              files.each do |file|
                diagnosis.files.attach(io: file, filename: file.original_filename)
              end
              { instance: diagnosis.instances.first }
            else
              raise GraphQL::ExecutionError.new(diagnosis.errors.to_json)
            end
          rescue ActiveRecord::RecordInvalid => e
            GraphQL::ExecutionError.new(e.record.errors.to_json)
          end
        end
      end
    end
  end
end

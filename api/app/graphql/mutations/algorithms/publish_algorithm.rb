module Mutations
  module Algorithms
    class PublishAlgorithm < Mutations::BaseMutation
      # Fields
      field :id, ID

      # Arguments
      argument :id, ID, required: true

      # Works with current_user
      def authorized?(id:)
        algorithm = Algorithm.find(id)
        project_id = algorithm.project.id
        return true if context[:current_api_v2_user].project_clinician?(project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      # Resolve
      def resolve(id:)
        begin
          algorithm = Algorithm.find(id)
          if algorithm
            GenerateAlgorithmJob.perform_now(algorithm)
            { id: algorithm.id }
          else
            GraphQL::ExecutionError.new(algorithm.errors.to_json)
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.to_json)
        end
      end
    end
  end
end

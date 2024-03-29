module Queries
  module Diagnoses
    class GetDiagnoses < Queries::BaseQuery
      type Types::DiagnosisType.connection_type, null: false

      argument :algorithm_id, ID, required: true
      argument :decision_tree_id, ID, required: false
      argument :search_term, String, required: false

      # Works with current_user
      def authorized?(algorithm_id:, decision_tree_id: nil, search_term: '')
        algorithm = Algorithm.find(algorithm_id)

        return true if context[:current_api_v2_user].has_access_to_project?(algorithm.project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.record.class))
      end

      def resolve(algorithm_id:, decision_tree_id: nil, search_term: '')
        return DecisionTree.find(decision_tree_id).diagnoses if decision_tree_id.present?

        algorithm = Algorithm.find(algorithm_id)
        if search_term.present?
          Diagnosis.where(decision_tree: algorithm.decision_trees).search(search_term, algorithm.project.language.code)
        else
          Diagnosis.where(decision_tree: algorithm.decision_trees)
        end
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

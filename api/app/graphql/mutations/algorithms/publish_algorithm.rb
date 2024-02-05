module Mutations
  module Algorithms
    class PublishAlgorithm < Mutations::BaseMutation
      # Fields
      field :invalid_decision_trees, [Types::DecisionTreeType]
      field :missing_nodes, [Types::NodeType]

      # Arguments
      argument :id, ID, required: true

      # Works with current_user
      def authorized?(id:)
        algorithm = Algorithm.find(id)
        project_id = algorithm.project.id

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_algorithm', status: algorithm.status) if algorithm.archived?

        return true if context[:current_api_v2_user].project_clinician?(project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      # Resolve
      def resolve(id:)
        begin
          algorithm = Algorithm.find(id)

          invalid_decision_trees = []
          algorithm.decision_trees.each do |decision_tree|
            decision_tree.manual_validate
            invalid_decision_trees.push(decision_tree) if decision_tree.errors.messages.any?
          end

          missing_nodes = Node.where(id: algorithm.missing_nodes)

          if invalid_decision_trees.empty? && missing_nodes.empty?
            GenerateAlgorithmJob.perform_now(id)
          end

          { invalid_decision_trees: invalid_decision_trees, missing_nodes: missing_nodes }
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.to_json)
        end
      end
    end
  end
end

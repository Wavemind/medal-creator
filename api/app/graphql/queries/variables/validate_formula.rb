module Queries
  module Variables
    class ValidateFormula < Queries::BaseQuery
      type Types::ValidateType, null: false

      argument :project_id, ID
      argument :formula, String

      # Works with current_user
      def authorized?(project_id:, formula: '')
        if context[:current_api_v2_user].admin? || context[:current_api_v2_user].user_projects.where(project_id: project_id).any?
          return true
        end

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      def resolve(project_id:, formula: '')
        project = Project.find(project_id)
        variable = project.nodes.new(type: 'Variables::BackgroundCalculation', answer_type_id: 5, label_en: 'Validate formula', formula: formula)
        variable.valid?
        errors = variable.errors.to_json
        variable.clear

        { errors: errors }
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.record.class))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

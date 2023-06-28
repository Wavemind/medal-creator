module Queries
  module AdministrationRoutes
    class GetAdministrationRoutes < Queries::BaseQuery
      type [Types::AdministrationRouteType], null: false

      def resolve
        AdministrationRoute.all
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

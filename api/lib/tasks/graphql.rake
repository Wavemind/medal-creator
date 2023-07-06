require 'graphql/rake_task'
require 'rake'

GraphQL::RakeTask.new(
  load_schema: lambda { |_task|
    require_relative '../../app/graphql/api_schema'
    ApiSchema
  }
)

namespace :graphql do
  task export: :environment do
    Rake::Task['graphql:schema:dump'].invoke
  end
end

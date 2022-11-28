require 'rails_helper'

module Mutations
  module Projects
    describe UpdateProject, type: :request do
      before(:each) do
        @project = Project.create!(name: "Project name", language: Language.first)
      end

      describe '.resolve' do
        it 'unsubscribes first user from project' do
          @user_project = @project.user_projects.create!(user: User.first)

          expect do
            post '/graphql',
                 params: { query: query }
            json = JSON.parse(response.body)
          end.to change { UserProject.count }.by(-1)
        end
      end

      def query
        <<~GQL
          mutation {
            unsubscribeFromProject(input: {id: #{@project.id}}) {
              project {
                id
                name
              }
            }
          }
        GQL
      end
    end
  end
end

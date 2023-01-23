require 'rails_helper'

module Mutations
  module Projects
    describe UpdateProject, type: :request do
      before(:each) do
        @project = Project.create!(name: 'Project name', language: Language.first)
      end

      describe '.resolve' do
        it 'returns an updated project' do
          post '/graphql',
               params: { query: query }

          json = JSON.parse(response.body)
          data = json['data']['updateProject']['project']

          expect(data['name']).to eq('Updated project name')
        end

        it 'removes users from project in update' do
          @user_project = @project.user_projects.create!(user: User.first)

          expect do
            post '/graphql',
                 params: { query: remove_users_query }
          end.to change { UserProject.count }.by(-1)
        end
      end

      def remove_users_query
        <<~GQL
          mutation {
            updateProject(input: {params: {id: #{@project.id}, userProjectsAttributes: [{id: #{@user_project.id}, _destroy: true}]}}) {
              project {
                id
                name
              }
            }
          }
        GQL
      end

      def query
        <<~GQL
          mutation {
            updateProject(input: {params: {id: #{@project.id}, name: "Updated project name"}}) {
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

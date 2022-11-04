require 'rails_helper'

module Mutations
  module Projects
    describe CreateProject, type: :request do
      before(:each) do
        @first_user = User.create!(first_name: 'Manu', last_name: 'Girard', email: 'manu.girard@wavemind.ch',
                                   password: '123456', password_confirmation: '123456')
        @second_user = User.create!(first_name: 'Colin', last_name: 'Ucak', email: 'colin.ucak@wavemind.ch',
                                    password: '123456', password_confirmation: '123456')
      end

      describe '.resolve' do
        it 'creates a project' do
          expect do
            post '/graphql',
                 params: { query: query }
          end.to change { Project.count }.by(1)
        end

        it 'creates a user project association' do
          expect do
            post '/graphql',
                 params: { query: query }
          end.to change { UserProject.count }.by(1)
        end

        it 'returns a project' do
          post '/graphql',
               params: { query: query }

          json = JSON.parse(response.body)
          data = json['data']['createProject']['project']

          expect(data['name']).to eq('New project')
        end
      end

      def query
        <<~GQL
          mutation {
            createProject(input: {params: {
              name: "New project",
              consentManagement: true,
              languageId: #{Language.find_by(code: 'en').id},
              emergencyContentTranslations: {en: "This is my new project", fr: "Ceci est mon nouveau projet"},
              userProjectsAttributes: [{userId: #{@second_user.id}, isAdmin: true}]}
            }) {
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

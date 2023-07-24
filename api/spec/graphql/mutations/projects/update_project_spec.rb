require 'rails_helper'

module Mutations
  module Projects
    describe UpdateProject, type: :graphql do
      let(:project) { create(:project) }
      let(:context) { { current_api_v1_user: User.first } }
      let(:user) { create(:user) }
      let(:new_project_attributes) { attributes_for(:variables_project) }
      let(:variables) { { params: new_project_attributes.merge({ id: project.id }) } }

      describe '.resolve' do
        it 'returns an updated project' do
          RailsGraphqlSchema.execute(query, variables: variables, context: context)

          project.reload

          expect(project.name).to eq(new_project_attributes[:name])
        end

        it 'removes users from project in update' do
          user_project = project.user_projects.create!(user: user, is_admin: false)
          expect do
            RailsGraphqlSchema.execute(query,
                                       variables: {
                                         params: {
                                           id: project.id,
                                           name: project.name,
                                           languageId: project.language_id,
                                           userProjectsAttributes: [{ id: user_project.id, _destroy: true }]
                                         }
                                       },
                                       context: context)
          end.to change { UserProject.count }.by(-1)
        end
      end

      def query
        <<~GQL
          mutation($params: ProjectInput!) {
            updateProject(input: { params: $params }) {
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

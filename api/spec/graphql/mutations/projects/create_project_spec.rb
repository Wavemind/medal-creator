require 'rails_helper'

module Mutations
  module Projects
    describe CreateProject, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:user_one) { create(:user, :clinician) }
        let(:user_two) { create(:user, :clinician) }
        let(:project_attributes) { attributes_for(:variables_project, :with_user_projects) }
        let(:variables) { { params: project_attributes } }

        it 'create a project' do
          expect do
            ApiSchema.execute(
              query, variables: variables, context: context
            )
          end.to change { Project.count }.by(1)
        end

        it 'return a project' do
          result = ApiSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'createProject',
              'project',
              'name'
            )
          ).to eq(project_attributes[:name])
        end
      end

      def query
        <<~GQL
          mutation($params: ProjectInput!) {
            createProject(input: { params: $params }) {
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

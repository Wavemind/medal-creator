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
        let(:invalid_project_attributes) { attributes_for(:variables_invalid_project) }
        let(:invalid_variables) { { params: invalid_project_attributes } }

        it 'create a project' do
          expect do
            RailsGraphqlSchema.execute(
              query, variables: variables, context: context
            )
          end.to change { Project.count }.by(1)
        end

        it 'return a project' do
          result = RailsGraphqlSchema.execute(
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

        it 'returns error when invalid' do
          result = RailsGraphqlSchema.execute(
            query, variables: invalid_variables, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(JSON.parse(result['errors'][0]['message'])['language'][0]).to eq('must exist')
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

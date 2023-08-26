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

        it 'creates a project and its default variables' do
          expect do
            ApiSchema.execute(
              query, variables: variables, context: context
            )
          end.to change { Project.count }.by(1).and change { Node.count }.by(20)

          expect(Project.last['medal_r_config']['basic_questions']).not_to be_empty
          expect(Project.last['medal_r_config']['optional_basic_questions']).not_to be_empty
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

        it 'returns error when invalid' do
          result = ApiSchema.execute(
            query, variables: invalid_variables, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('Variable $params of type ProjectInput! was provided invalid value for languageId (Expected value to not be null)')
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

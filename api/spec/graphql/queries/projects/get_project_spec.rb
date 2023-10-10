require 'rails_helper'

module Queries
  module Projects
    describe GetProject, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v2_user: User.first } }
        let(:project) { create(:project) }
        let(:variables) { { id: project.id } }

        it 'return a project' do
          result = ApiSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getProject',
              'name'
            )
          ).to eq(project[:name])
        end

        it 'returns an error because the ID was not found' do
          result = ApiSchema.execute(
            query, variables: { id: 999 }, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('Project does not exist')
        end
      end

      def query
        <<~GQL
          query ($id: ID!) {
            getProject(id: $id) {
              id
              name
            }
          }
        GQL
      end
    end
  end
end

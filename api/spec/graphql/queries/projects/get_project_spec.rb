require 'rails_helper'

module Queries
  module Projects
    describe GetProject, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
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

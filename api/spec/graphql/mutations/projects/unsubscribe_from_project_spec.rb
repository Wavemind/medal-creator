require 'rails_helper'

module Mutations
  module Projects
    describe UpdateProject, type: :graphql do
      let(:context) { { current_api_v2_user: User.first } }
      let(:project) { create(:project, user: User.first) }
      let(:variables) { { id: project.id } }

      describe '.resolve' do
        it 'unsubscribes first user from project' do
          ApiSchema.execute(query, variables: variables, context: context)
          expect(project.user_projects.count).to eq(0)
        end
      end

      def query
        <<~GQL
          mutation($id: ID!) {
            unsubscribeFromProject(input: {id: $id}) {
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

require 'rails_helper'

module Mutations
  module QuestionsSequences
    describe DestroyQuestionsSequence, type: :graphql do
      describe '.resolve' do
        it 'Removes components conditions and children in cascade', focus: true do
          questions_sequence = Project.first.questions_sequences.create!(type: 'QuestionsSequences::PredefinedSyndrome', label_en: 'Test')
          expect do
            ApiSchema.execute(
              query,
              variables: { id: questions_sequence.id },
              context: { current_api_v2_user: User.first }
            )
          end.to change { Node.count }.by(-1)
        end

        it 'Returns error if trying to remove node with instances' do
          Algorithm.first.components.create!(node: QuestionsSequence.first)
          result = ApiSchema.execute(
            query,
            variables: { id: QuestionsSequence.first.id },
            context: { current_api_v2_user: User.first }
          )

          expect(
            result.dig(
              'errors',
              0,
              'message'
            )
          ).to eq('This questions sequence has instances and cannot be destroyed.')
        end
      end

      def query
        <<~GQL
          mutation($id: ID!) {
            destroyQuestionsSequence(
              input: {
                id: $id
            }){
              id
            }
          }
        GQL
      end
    end
  end
end

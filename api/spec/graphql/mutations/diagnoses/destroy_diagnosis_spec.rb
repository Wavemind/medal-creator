require 'rails_helper'

module Mutations
  module Diagnoses
    describe DestroyDiagnosis, type: :request do
      describe '.resolve' do
        it 'Removes components conditions and children in cascade' do
          expect do
            post '/graphql',
                 params: { query: query }
          end.to change { Node.count }.by(-1)
             .and change { Instance.count }.by(-4)
             .and change { Condition.count }.by(-6)
             .and change { Child.count }.by(-5)
        end
      end

      def query
        <<~GQL
          mutation {
            destroyDiagnosis(
              input: {
                id: #{Diagnosis.first.id}
            }){
              id
            }
          }
        GQL
      end
    end
  end
end

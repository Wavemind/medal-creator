require 'rails_helper'

module Mutations
  module Drugs
    describe CreateDrug, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:drug_attributes) { attributes_for(:variables_drug) }
        let(:invalid_drug_attributes) { attributes_for(:variables_drug_invalid) }
        let(:variables) { { params: drug_attributes } }

        it 'create a drug' do
          result = ''
          expect do
            result = RailsGraphqlSchema.execute(query, variables: variables, context: context)
          end.to change { Node.count }.by(1).and change { Formulation.count }.by(1)
          expect(result.dig(
                   'data',
                   'createDrug',
                   'drug',
                   'labelTranslations',
                   'en'
                 )).to eq(drug_attributes[:labelTranslations][:en])
          expect(result.dig('data', 'createDrug', 'drug', 'id')).not_to be_blank
        end

        it 'raises an error if params are invalid' do
          result = RailsGraphqlSchema.execute(
            query, variables: { params: invalid_drug_attributes,
                                files: [] }, context: { current_api_v1_user: User.first }
          )

          expect(result['errors']).not_to be_empty
          expect(JSON.parse(result['errors'][0]['message'])['level_of_urgency'][0]).to eq('must be less than or equal to 10')
        end
      end

      def query
        <<~GQL
          mutation($params: DrugInput!) {
            createDrug(
              input: {
                params: $params
              }
            ) {
              drug {
                id
                labelTranslations {
                  en
                }
              }
            }
          }
        GQL
      end
    end
  end
end

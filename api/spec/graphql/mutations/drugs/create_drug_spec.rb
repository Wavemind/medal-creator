require 'rails_helper'

module Mutations
  module Drugs
    describe CreateDrug, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:drug_attributes) { attributes_for(:variables_drug) }
        let(:invalid_drug_attributes) { attributes_for(:variables_drug_invalid) }
        let(:invalid_formulation_attributes) { attributes_for(:variables_drug_invalid_formulation) }
        let(:variables) { { params: drug_attributes } }

        it 'create a drug' do
          result = ''
          expect do
            result = ApiSchema.execute(query, variables: variables, context: context)
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
          result = ApiSchema.execute(
            query, variables: { params: invalid_drug_attributes }, context: { current_api_v1_user: User.first }
          )

          expect(result['errors']).not_to be_empty
          expect(JSON.parse(result['errors'][0]['message'])['level_of_urgency'][0]).to eq('must be less than or equal to 10')
        end

        it 'raises an error if formulation params are invalid' do
          result = ApiSchema.execute(
            query, variables: { params: invalid_formulation_attributes }, context: { current_api_v1_user: User.first }
          )

          expect(result['errors']).not_to be_empty
          expect(JSON.parse(result['errors'][0]['message'])['formulations.minimal_dose_per_kg'][0]).to eq('The minimum dose per kg can\'t be greater than the maximum dose per kg')
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

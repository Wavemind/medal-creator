require 'rails_helper'

module Mutations
  module Drugs
    describe UpdateDrug, type: :graphql do
      describe '.resolve' do
        let(:drug) { create(:drug) }
        let(:context) { { current_api_v1_user: User.first } }
        let(:new_drug_attributes) { attributes_for(:variables_drug) }
        let(:variables) { { params: new_drug_attributes.merge({ id: drug.id }) } }

        it 'updates the drug, then remove its formulation' do
          RailsGraphqlSchema.execute(query, variables: variables, context: context)

          drug.reload

          expect(drug.label_translations['en']).to eq(new_drug_attributes[:labelTranslations][:en])

          new_params = variables
          new_params[:params][:formulationsAttributes][0]['id'] = drug.formulations.first.id
          new_params[:params][:formulationsAttributes][0]['_destroy'] = true

          expect do
            RailsGraphqlSchema.execute(query, variables: new_params, context: context)
          end.to change { Formulation.count }.by(-1)
        end

        it 'returns the updated drug' do
          result = RailsGraphqlSchema.execute(query, variables: variables, context: context)

          expect(
            result.dig(
              'data',
              'updateDrug',
              'drug',
              'id'
            )
          ).to eq(drug.id.to_s)

          expect(
            result.dig(
              'data',
              'updateDrug',
              'drug',
              'labelTranslations',
              'en'
            )
          ).to eq(new_drug_attributes[:labelTranslations][:en])
        end
      end

      def query
        <<~GQL
          mutation($params: DrugInput!) {
            updateDrug(
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

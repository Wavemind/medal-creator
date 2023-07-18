require 'rails_helper'

module Mutations
  module Instances
    describe UpdateInstance, type: :graphql do
      describe '.resolve' do
        let(:instance) { create(:instance) }
        let(:context) { { current_api_v1_user: User.first } }
        let(:new_instance_attributes) { attributes_for(:variables_instance) }
        let(:variables) { { params: new_instance_attributes.merge({ id: instance.id }) } }

        it 'update the instance' do
          RailsGraphqlSchema.execute(query, variables: variables, context: context)

          instance.reload

          expect(instance.description_translations['en']).to eq(new_instance_attributes[:descriptionTranslations][:en])
        end

        it 'returns the updated instance' do
          result = RailsGraphqlSchema.execute(query, variables: variables, context: context)

          expect(
            result.dig(
              'data',
              'updateInstance',
              'instance',
              'id'
            )
          ).to eq(instance.id.to_s)

          expect(
            result.dig(
              'data',
              'updateInstance',
              'instance',
              'diagramName'
            )
          ).to eq(Algorithm.first.name)
        end
      end

      def query
        <<~GQL
          mutation($params: InstanceInput!) {
            updateInstance(
              input: {
                params: $params
              }
            ) {
              instance {
                id
                diagramName
                descriptionTranslations {
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

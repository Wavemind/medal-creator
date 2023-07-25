require 'rails_helper'

module Mutations
  module Instances
    describe CreateInstance, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:instance_attributes) { attributes_for(:variables_instance) }
        let(:invalid_instance_attributes) { attributes_for(:invalid_instance) }
        let(:variables) { { params: instance_attributes } }
        let(:invalid_variables) { { params: invalid_instance_attributes } }

        it 'create a instance' do
          result = ApiSchema.execute(query, variables: variables, context: context)

          expect(result.dig(
                   'data',
                   'createInstance',
                   'instance',
                   'diagramName'
                 )).to eq(Algorithm.first.name)
          expect(result.dig('data', 'createInstance', 'instance', 'id')).not_to be_blank
        end

        it 'raises an error if params are invalid' do
          result = ApiSchema.execute(query, variables: invalid_variables, context: context)

          expect(result['errors']).not_to be_empty
        end

        it 'raises an error when trying to create an instance from same diagram with same node' do
          ApiSchema.execute(query, variables: variables, context: context)
          result = ApiSchema.execute(query, variables: variables, context: context)

          expect(result['errors']).not_to be_empty
          expect(JSON.parse(result['errors'][0]['message'])['node_id'][0]).to eq('is not available')
        end
      end

      def query
        <<~GQL
          mutation($params: InstanceInput!) {
            createInstance(
              input: {
                params: $params
              }
            ) {
              instance {
                id
                diagramName
              }
            }
          }
        GQL
      end
    end
  end
end

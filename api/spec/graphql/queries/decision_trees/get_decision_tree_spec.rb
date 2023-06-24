require 'rails_helper'

module Queries
  module DecisionTrees
    describe GetDecisionTree, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:decision_tree) { create(:decision_tree) }
        let(:variables) { { id: decision_tree.id } }

        it 'return a decision tree' do
          result = RailsGraphqlSchema.execute(
            query, variables: variables, context: context
          )

          expect(
            result.dig(
              'data',
              'getDecisionTree',
              'labelTranslations',
              'en'
            )
          ).to eq(decision_tree.label_translations['en'])
        end

        it 'returns available nodes for the diagram' do
          available_nodes = decision_tree.available_nodes
          decision_tree.components.create(node: available_nodes.first)

          result = RailsGraphqlSchema.execute(
            available_nodes_query, variables: { instanceableId: decision_tree.id, instanceableType: decision_tree.class.name }, context: context
          )

          new_available_nodes = result.dig('data', 'getAvailableNodes')

          expect(available_nodes.count).to eq(new_available_nodes.count + 1)
          expect(new_available_nodes.select{|node| node["id"] == available_nodes.first.id.to_s}).not_to be_present
          expect(new_available_nodes.select{|node| node["id"] == available_nodes.second.id.to_s}).to be_present
        end

        it 'ensures available_nodes does not have not usable node types', focus: true do
          decision_tree.diagnoses.create!(label_en: 'New diagnosis')

          result = RailsGraphqlSchema.execute(
            available_nodes_query, variables: { instanceableId: decision_tree.id, instanceableType: decision_tree.class.name }, context: context
          )

          available_nodes = result.dig('data', 'getAvailableNodes')

          expect(available_nodes.select{|node| node["category"] == "VitalSignAnthropometric"}).not_to be_present
          expect(available_nodes.select{|node| node["category"] == "Symptom"}).to be_present
          expect(available_nodes.select{|node| node["category"] == "Diagnosis"}).to be_present
          expect(available_nodes.select{|node| node["category"] == "Drug"}).not_to be_present
        end

        it 'allows to search upon available nodes' do
          diagnosis = decision_tree.diagnoses.create!(label_en: 'New diagnosis')

          result = RailsGraphqlSchema.execute(
            available_nodes_query, variables: { instanceableId: decision_tree.id, instanceableType: decision_tree.class.name, searchTerm: diagnosis.label_en }, context: context
          )

          available_nodes = result.dig('data', 'getAvailableNodes')
          expect(available_nodes.select{|node| node["id"] == diagnosis.id.to_s}).to be_present
        end

        it 'returns an error because the ID was not found' do
          result = RailsGraphqlSchema.execute(
            query, variables: { id: 999 }, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('DecisionTree does not exist')
        end
      end

      def available_nodes_query
        <<~GQL
          query ($instanceableId: ID!, $instanceableType: String!, $searchTerm: String) {
            getAvailableNodes(instanceableId: $instanceableId, instanceableType: $instanceableType, searchTerm: $searchTerm) {
              id
              answersJson
              category
            }
          }
        GQL
      end

      def query
        <<~GQL
          query ($id: ID!) {
            getDecisionTree(id: $id) {
              id
              labelTranslations {
                en
              }
            }
          }
        GQL
      end
    end
  end
end

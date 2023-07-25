require 'rails_helper'

module Queries
  module DecisionTrees
    describe GetDecisionTree, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v1_user: User.first } }
        let(:decision_tree) { create(:decision_tree) }
        let(:variables) { { id: decision_tree.id } }

        it 'return a decision tree' do
          result = ApiSchema.execute(
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

        it 'ensures available nodes are correct even after creating an instance which would remove the node from the list' do
          available_nodes = decision_tree.available_nodes
          decision_tree.components.create(node: available_nodes.first)

          result = ApiSchema.execute(
            available_nodes_query, variables: { instanceableId: decision_tree.id, instanceableType: decision_tree.class.name }, context: context
          )

          new_available_nodes = result.dig('data', 'getAvailableNodes')

          expect(available_nodes.count).to eq(new_available_nodes.count + 1)
          expect(new_available_nodes.select{|node| node["id"] == available_nodes.first.id.to_s}).not_to be_present
          expect(new_available_nodes.select{|node| node["id"] == available_nodes.second.id.to_s}).to be_present
        end

        it 'ensures available nodes does not have not usable node types' do
          decision_tree.diagnoses.create!(label_en: 'New diagnosis')

          result = ApiSchema.execute(
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

          result = ApiSchema.execute(
            available_nodes_query, variables: { instanceableId: decision_tree.id, instanceableType: decision_tree.class.name, searchTerm: diagnosis.label_en }, context: context
          )

          available_nodes = result.dig('data', 'getAvailableNodes')
          expect(available_nodes.select{|node| node["id"] == diagnosis.id.to_s}).to be_present
        end

        it 'ensures components (instances in diagram) are correct even after creating an instance which would add the node to the list' do
          components_count = decision_tree.components.decision_tree_diagram.count
          diagnosis = decision_tree.diagnoses.create!(label_en: 'New diagnosis')
          decision_tree.components.create(node: diagnosis)

          result = ApiSchema.execute(
            components_query, variables: { instanceableId: decision_tree.id, instanceableType: decision_tree.class.name }, context: context
          )

          new_components = result.dig('data', 'getComponents')

          expect(components_count).to eq(new_components.count - 1)
          expect(new_components.select{|instance| instance["nodeId"] == diagnosis.id}).not_to be_present
        end

        it 'returns errors or warnings if any when validating' do
          # Validate with no issue in diagram
          result = ApiSchema.execute(
            validate_query, variables: { instanceableId: decision_tree.id, instanceableType: decision_tree.class.name }, context: context
          )

          errors = result.dig('data', 'validate')[:errors]
          expect(errors).not_to be_present

          # Instance a diagnosis with no condition on it
          diagnosis = decision_tree.diagnoses.create!(label_en: 'New diagnosis')
          decision_tree.components.create(node: diagnosis)
          decision_tree.components.create(node: Node.second)

          # Validate with a diagnosis without condition
          result = ApiSchema.execute(
            validate_query, variables: { instanceableId: decision_tree.id, instanceableType: decision_tree.class.name }, context: context
          )

          errors = result.dig('data', 'validate')[:errors]

          expect(errors).to be_present
          expect(errors[0]).to eq("The Diagnosis #{diagnosis.full_reference} has no condition.")

          warnings = result.dig('data', 'validate')[:warnings]
          expect(warnings).to be_present
          expect(warnings[0]).to eq("#{Node.second.full_reference} is not linked to any children.")
        end

        it 'returns an error because the ID was not found' do
          result = ApiSchema.execute(
            query, variables: { id: 999 }, context: context
          )

          expect(result['errors']).not_to be_empty
          expect(result['errors'][0]['message']).to eq('DecisionTree does not exist')
        end
      end

      def available_nodes_query
        <<~GQL
          query ($instanceableId: ID!, $instanceableType: DiagramEnum!, $searchTerm: String) {
            getAvailableNodes(instanceableId: $instanceableId, instanceableType: $instanceableType, searchTerm: $searchTerm) {
              id
              diagramAnswers {
                id
              }
              category
            }
          }
        GQL
      end

      def components_query
        <<~GQL
          query ($instanceableId: ID!, $instanceableType: DiagramEnum!) {
            getComponents(instanceableId: $instanceableId, instanceableType: $instanceableType) {
              id
              nodeId
            }
          }
        GQL
      end

      def validate_query
        <<~GQL
          query ($instanceableId: ID!, $instanceableType: DiagramEnum!) {
            validate(instanceableId: $instanceableId, instanceableType: $instanceableType)
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

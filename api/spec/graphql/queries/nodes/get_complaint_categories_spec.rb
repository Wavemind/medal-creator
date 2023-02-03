require 'rails_helper'

describe Queries::Nodes::GetComplaintCategories, type: :request do
  before(:each) do
    Project.first.nodes.create!(type: 'Questions::ComplaintCategory', label_en: 'Fever', answer_type: AnswerType.first)
  end

  describe '.resolve' do
    it 'returns every algorithms of a project' do
      query = <<-GRAPHQL
              query {
                getComplaintCategories(projectId: #{Project.first.id}, first: 5){
                  edges {
                    node {
                      labelTranslations {
                        en
                      }
                    }
                  }
                }
              }
      GRAPHQL

      post '/graphql', params: { query: query }
      json = JSON.parse(response.body)
      data = json['data']['getComplaintCategories']['edges'][-1]['node']

      expect(data['labelTranslations']).to include(
         'en' => 'Fever'
       )
    end
  end
end

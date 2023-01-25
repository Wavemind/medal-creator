require 'rails_helper'

describe Queries::Projects::GetProjects, type: :request do
  before(:each) do
    Project.create!(language: Language.first, name: 'My tested new project')
  end
  describe '.resolve' do
    it 'returns every projects' do
      query = <<-GRAPHQL
              query{
                getProjects {
                  edges{
                    node {
                      id
                      name
                    }
                  }
                }
              }
      GRAPHQL

      post '/graphql', params: { query: query }
      json = JSON.parse(response.body)
      data = json['data']['getProjects']['edges']
      last_project = data[-1]['node']

      expect(last_project['name']).to eq('My tested new project')
    end
  end
end

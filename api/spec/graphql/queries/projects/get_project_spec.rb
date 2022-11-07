require 'rails_helper'

describe Queries::Projects::GetProject, type: :request do
  describe '.resolve' do
    it 'returns a project' do
      query = <<-GRAPHQL
              query{
                getProject(id: #{Project.first.id}){
                  name
                }
              }
      GRAPHQL

      post '/graphql', params: { query: query }
      json = JSON.parse(response.body)
      data = json['data']['getProject']
      expect(data['name']).to eq('Project for Tanzania')
    end
  end
end

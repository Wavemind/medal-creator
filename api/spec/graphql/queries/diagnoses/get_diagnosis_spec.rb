require 'rails_helper'

describe Queries::Diagnoses::GetDiagnosis, type: :request do
  describe '.resolve' do
    it 'returns a diagnosis' do
      query = <<-GRAPHQL
            query {
              getDiagnosis(id: #{Diagnosis.first.id}){
                labelTranslations {
                  en
                }
              }
            }
      GRAPHQL

      post '/graphql', params: { query: query }
      json = JSON.parse(response.body)
      data = json['data']['getDiagnosis']

      expect(data['labelTranslations']['en']).to eq('Cold')
    end
  end
end

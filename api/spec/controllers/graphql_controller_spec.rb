require 'rails_helper'

describe Api::V1::GraphqlController, type: :controller do
  User.create!(first_name: 'Manu', last_name: 'Girard', email: 'manu.girard@wavemind.ch', password: '123456')
  it "retrieves first user" do
    query = <<-GRAPHQL
      query{
        getUser(id: 1){
          firstName
          lastName
        }
      }
    GRAPHQL
    result = RailsGraphqlSchema.execute(query)
    @user = result['data']['getUser']
    expect(@user['firstName']).to eq('Manu')
    expect(@user['lastName']).to eq('Girard')
  end
end
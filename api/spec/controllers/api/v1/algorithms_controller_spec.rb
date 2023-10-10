require 'rails_helper'

RSpec.describe Api::V1::AlgorithmsController, type: :controller do
  it 'Get algorithms of a project' do
    get :index, params: { id: Project.first.old_medalc_id }, xhr: true
    algorithms = JSON.parse(response.body)

    expect(response.status).to eq(200)

    expect(algorithms.count).to eq(Project.count)
    expect(algorithms.select{|algorithm| algorithm['id'] == Algorithm.first.id}).to be_present
  end

  it 'Throws error if the project does not exist' do
    get :index, params: { id: 999 }, xhr: true

    expect(response.status).to eq(422)
  end

  it 'Gets an algorithm' do
    get :show, params: { id: Algorithm.first.old_medalc_id, json_version: 1 }, xhr: true
    algorithm = JSON.parse(response.body)

    expect(response.status).to eq(200)

    expect(algorithm['id']).to eq(Algorithm.first.id)
  end

  it 'Throws error if the algorithm does not exist' do
    get :show, params: { id: 999 }, xhr: true

    expect(response.status).to eq(422)
  end

  it 'Gets medal_data config from an algorithm' do
    get :medal_data_config, params: { version_id: Algorithm.first.old_medalc_id }, xhr: true
    medal_data_config = JSON.parse(response.body)

    expect(response.status).to eq(200)

    expect(medal_data_config[Algorithm.first.medal_data_config_variables.first.api_key]).to be_present
  end
end

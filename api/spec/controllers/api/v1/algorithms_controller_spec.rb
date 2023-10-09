require 'rails_helper'

RSpec.describe Api::V1::AlgorithmsController, type: :controller do
  it 'Get algorithms of a project', focus: true do
    get :index, params: { id: Algorithm.first.old_medalc_id }, xhr: true
    algorithms = JSON.parse(response.body)

    expect(response.status).to eq(200)

    expect(algorithms.count).to eq(Project.count)
    expect(algorithms.select{|algorithm| algorithm['id'] == Algorithm.first.id}).to be_present
  end

  it 'Throws error if the project does not exist', focus: true do
    get :index, params: { id: 999 }, xhr: true

    expect(response.status).to eq(422)
  end

  it 'Get algorithms of a project', focus: true do
    get :show, params: { id: Algorithm.first.old_medalc_id }, xhr: true
    algorithm = JSON.parse(response.body)

    expect(response.status).to eq(200)

    expect(algorithm['id']).to eq(Algorithm.first.id)
  end

  it 'Throws error if the project does not exist', focus: true do
    get :show, params: { id: 999 }, xhr: true

    expect(response.status).to eq(422)
  end
end

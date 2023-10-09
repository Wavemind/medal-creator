require 'rails_helper'

RSpec.describe Api::V2::ProjectsController, type: :controller do
  it 'Get projects', focus: true do
    get :index, params: { }, xhr: true
    projects = JSON.parse(response.body)

    expect(response.status).to eq(200)

    expect(projects.count).to eq(Project.count)
    expect(projects.select{|project| project['id'] == Project.first.id}).to be_present
  end

  it 'Get emergency content of a project', focus: true do
    post :emergency_content, params: { id: Project.first.id }, xhr: true
    emergency_content = JSON.parse(response.body)

    expect(response.status).to eq(200)
    expect(emergency_content['emergency_content_translations']).to eq(Project.first.emergency_content_translations)
  end

  it 'Does not send emergency content when already up to date', focus: true do
    post :emergency_content, params: { id: Project.first.old_medalc_id, emergency_content_version: Project.first.emergency_content_version }, xhr: true

    expect(response.status).to eq(204)
  end

  it 'Throws error if the project does not exist', focus: true do
    post :emergency_content, params: { id: 999, emergency_content_version: Project.first.emergency_content_version }, xhr: true

    expect(response.status).to eq(422)
  end
end

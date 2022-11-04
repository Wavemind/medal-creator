require 'rails_helper'

describe Queries::Projects::GetProjects, type: :request do
  before(:each) do
    @user = User.create!(first_name: 'Manu', last_name: 'Girard', email: 'manu.girard@wavemind.ch', password: '123456',
                         password_confirmation: '123456')
  end
  describe '.resolve' do

  end
end

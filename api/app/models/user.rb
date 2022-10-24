# frozen_string_literal: true

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  devise :invitable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  include DeviseTokenAuth::Concerns::User

  has_many :webauthn_credentials, dependent: :destroy
  has_many :user_projects
  has_many :projects, thought: :user_projects

  validates :webauthn_id, uniqueness: true, allow_nil: true
  validates :first_name, presence: true

  enum role: %i[admin clinician deployment_manager]
end

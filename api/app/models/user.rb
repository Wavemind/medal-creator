# frozen_string_literal: true

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  include DeviseTokenAuth::Concerns::User

  has_many :webauthn_credentials, dependent: :destroy

  validates :webauthn_id, uniqueness: true, allow_nil: true

  enum role: [:admin, :clinician, :deployment_manager]
end

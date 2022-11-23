# frozen_string_literal: true

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  devise :invitable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :invitable
  include DeviseTokenAuth::Concerns::User

  attr_accessor :skip_password_validation

  has_many :webauthn_credentials, dependent: :destroy
  has_many :user_projects
  has_many :projects, through: :user_projects

  validates :webauthn_id, uniqueness: true, allow_nil: true
  validates :first_name, presence: true
  validates :last_name, presence: true

  enum role: %i[admin clinician deployment_manager]

  protected

  def password_required?
    return false if skip_password_validation
    super
  end
end

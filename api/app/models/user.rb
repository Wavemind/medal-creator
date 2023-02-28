# frozen_string_literal: true

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  devise :invitable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :invitable, :lockable, :timeoutable
  include DeviseTokenAuth::Concerns::User

  attr_accessor :skip_password_validation

  has_many :user_projects
  has_many :projects, through: :user_projects

  validates :first_name, presence: true
  validates :last_name, presence: true
  validate :password_complexity

  accepts_nested_attributes_for :user_projects, reject_if: :all_blank, allow_destroy: true

  enum role: %i[admin clinician deployment_manager]

  protected

  def password_required?
    return false if skip_password_validation

    super
  end

  # Check password complexity
  # Rules: 8 characters
  # 1 upcase, 1 low case, 1 number, 1 special char
  def password_complexity
    if password.present? && !password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_§]).{8,}$/)
      errors.add :password, I18n.t('errors.messages.password_complexity')
    end
  end
end

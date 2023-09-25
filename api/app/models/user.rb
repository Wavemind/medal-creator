# frozen_string_literal: true

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  devise :invitable, :registerable,
         :recoverable, :rememberable, :validatable, :invitable, :lockable, :timeoutable, :two_factor_authenticatable
  include DeviseTokenAuth::Concerns::User

  attr_accessor :skip_password_validation

  has_many :user_projects
  has_many :projects, through: :user_projects

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :role, presence: true
  validates :email, uniqueness: true
  validate :password_complexity
  before_update :lock_clear_tokens

  accepts_nested_attributes_for :user_projects, reject_if: :all_blank, allow_destroy: true

  enum role: %i[admin clinician deployment_manager]

  def self.ransackable_attributes(auth_object = nil)
    %w[first_name last_name email]
  end

  def self.ransackable_associations(auth_object = nil)
    []
  end

  def clinician?
    %w[admin clinician].include?(role)
  end

  # Disable the use of OTP-based two-factor.
  def disable_two_factor!
    update!(
      otp_required_for_login: false,
      otp_secret: nil
    )
  end

  # Ensure that the user is prompted for their OTP when they login
  def enable_two_factor!
    update!(otp_required_for_login: true)
  end

  # Return full name
  def full_name
    "#{first_name} #{last_name}"
  end

  # Generate an OTP secret it it does not already exist
  def generate_two_factor_secret_if_missing!
    return unless otp_secret.nil?

    update!(otp_secret: User.generate_otp_secret)
  end

  # URI for OTP two-factor QR code
  def two_factor_qr_code_uri
    issuer = ENV['OTP_2FA_ISSUER_NAME']
    label = email

    otp_provisioning_uri(label, issuer: issuer)
  end

  protected

  # Clear tokens field when we lock the user
  def lock_clear_tokens
    if locked_at_changed? && locked_at.present?
      self.tokens = {}
    end
  end

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

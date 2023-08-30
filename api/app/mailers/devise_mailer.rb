class DeviseMailer < Devise::Mailer
  default from: email_address_with_name('noreply@unisante.ch', 'medAL-creator')

  def invitation_instructions(*args)
    attachments.inline['logo-black.png'] = File.read(File.join(Rails.root, 'app', 'assets', 'images', 'logo-black.png'))
    super
  end

  def reset_password_instructions(record, token, opts={})
    attachments.inline['logo-black.png'] = File.read(File.join(Rails.root, 'app', 'assets', 'images', 'logo-black.png'))
    super(record, token, opts)
  end
end
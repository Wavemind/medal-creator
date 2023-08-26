class DeviseMailer < Devise::Mailer
  default from: email_address_with_name('noreply@unisante.ch', 'Unisanté')
  def reset_password_instructions(record, token, opts={})
    attachments.inline['logo-black.png'] = File.read(File.join(Rails.root, 'app', 'assets', 'images', 'logo-black.png'))
    super(record, token, opts)
  end

end
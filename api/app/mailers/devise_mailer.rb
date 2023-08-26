class DeviseMailer < Devise::Mailer

  def reset_password_instructions(record, token, opts={})
    attachments.inline['logo-black.png'] = File.read(File.join(Rails.root, 'app', 'assets', 'images', 'logo-black.png'))
    super(record, token, opts)
  end

end
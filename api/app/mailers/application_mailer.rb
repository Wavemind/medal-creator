class ApplicationMailer < ActionMailer::Base
  default from: email_address_with_name('noreply@unisante.ch', 'medAL-creator')
  default attachment: File.read(File.join(Rails.root, 'app', 'assets', 'images', 'logo-black.png'))
  layout 'mailer'
end

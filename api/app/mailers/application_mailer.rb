class ApplicationMailer < ActionMailer::Base
  default from: 'Unisanté <noreply@unisante.ch>'
  default attachment: File.read(File.join(Rails.root, 'app', 'assets', 'images', 'logo-black.png'))
  layout 'mailer'
end

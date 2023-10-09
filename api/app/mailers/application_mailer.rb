class ApplicationMailer < ActionMailer::Base
  default from: email_address_with_name('noreply@unisante.ch', 'medAL-creator')
  layout 'mailer'
end

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch('FRONT_END_URL', 'http://localhost:3001')
    resource '*',
             headers: :any,
             expose: %w[access-token expiry uid client],
             methods: %i[get post put patch delete options head]
  end
end

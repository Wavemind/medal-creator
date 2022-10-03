User.create(email: 'dev@wavemind.ch', password: '123456', password_confirmation: '123456')

data = JSON.parse(File.read(Rails.root.join('db/old_data.json')))
puts '--- Creating users'
data['users'].each do |user|
  User.create!(
    first_name: user['first_name'],
    last_name: user['last_name'],
    email: user['email'],
    role: user['role'],
    password: 'P@ssw0rd',
    password_confirmation: 'P@ssw0rd'
  )
end
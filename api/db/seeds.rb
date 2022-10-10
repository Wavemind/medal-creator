User.create(email: 'dev@wavemind.ch', password: '123456', password_confirmation: '123456')

data = JSON.parse(File.read(Rails.root.join('db/old_data.json')))
puts '--- Creating users'
data['users'].each do |user|
  User.create!(
    first_name: user['first_name'],
    last_name: user['last_name'],
    email: user['email'],
    role: user['role'],
    password: ENV['USER_DEFAULT_PASSWORD'],
    password_confirmation: ENV['USER_DEFAULT_PASSWORD'],
    old_medalc_id: user['id']
  )
end

data['algorithms'].each do |algorithm|
  author = User.find_by(old_medalc_id: algorithm['user_id']) || User.first
  project = Project.create!(
    algorithm.slice('name', 'project', 'medal_r_config', 'village_json', 'consent_management', 'track_referral',
                    'emergency_content_version', 'emergency_content_translations', 'created_at', 'updated_at')
             .merge(user: author)
  )

  algorithm['users'].each do |user|
    user = User.find_by(old_medalc_id: user['id'])
    project.users << user if user.present?
  end

  algorithm['questions'].each do |question|
    project.questions.create(question.slice())
  end

  algorithm['questions_sequences'].each do |question|

  end

  algorithm['drugs'].each do |question|

  end

  algorithm['managements'].each do |question|

  end

  algorithm['versions'].each do |question|

  end


  end

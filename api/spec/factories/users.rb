FactoryBot.define do
  factory :user do
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    email { Faker::Internet.email }
    password { ENV['USER_DEFAULT_PASSWORD'] }
    password_confirmation { password }

    transient do
      role { User.roles.values.sample }
    end

    after(:build) do |user, evaluator|
      user.role = evaluator.role
    end
  end

  factory :variables_user, class: 'User' do
    firstName { Faker::Name.first_name }
    lastName { Faker::Name.last_name }
    role { User.roles.keys[Faker::Number.between(from: 0, to: 2)] }
    email { Faker::Internet.email }
    password { ENV['USER_DEFAULT_PASSWORD'] }
    passwordConfirmation { password }
  end
end

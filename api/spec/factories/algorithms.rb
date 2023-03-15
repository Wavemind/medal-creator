FactoryBot.define do
  factory :algorithm do
    project_id { Project.first.id }
    name { Faker::Lorem.sentence }
    age_limit { Faker::Number.between(from: 1, to: 100) }
    description_translations { { en: Faker::Lorem.paragraph, fr: Faker::Lorem.paragraph } }
    age_limit_message_translations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
  end

  factory :variables_algorithm, class: 'Algorithm' do
    projectId { Project.first.id }
    name { Faker::Lorem.sentence }
    ageLimit { Faker::Number.between(from: 1, to: 100) }
    descriptionTranslations { { en: Faker::Lorem.paragraph, fr: Faker::Lorem.paragraph } }
    ageLimitMessageTranslations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
  end
end

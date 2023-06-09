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
    minimumAge { Faker::Number.between(from: 1, to: 100) }
    ageLimit { Faker::Number.between(from: 1, to: 100) }
    descriptionTranslations { { en: Faker::Lorem.paragraph, fr: Faker::Lorem.paragraph } }
    ageLimitMessageTranslations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
    medalDataConfigVariablesAttributes do
      [
        { variableId: Variable.first.id, label: 'Var 1', apiKey: 'var_1' },
        { variableId: Variable.second.id, label: 'Var 2', apiKey: 'var_2' },
        { variableId: Variable.third.id, label: 'Var 3', apiKey: 'var_3' }
      ]
    end
  end

  # Missing Age limit
  factory :variables_invalid_algorithm, class: 'Algorithm' do
    projectId { Project.first.id }
    name { Faker::Lorem.sentence }
  end
end

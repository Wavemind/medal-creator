FactoryBot.define do
  factory :complaint_category, class: 'Variables::ComplaintCategory' do
    project { Project.first }
    answer_type { AnswerType.first }
    label_translations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
  end

  factory :variable, class: 'Variables::Symptom' do
    project { Project.first }
    answer_type { AnswerType.first }
    system { Variable.systems.keys[Faker::Number.between(from: 0, to: 20)] }
    label_translations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
  end

  factory :variables_integer_variable, class: 'Variables::Exposure' do
    type { 'Variables::Exposure' }
    projectId { Project.first.id }
    answerTypeId { AnswerType.second.id }
    system { Variable.systems.keys[Faker::Number.between(from: 0, to: 20)] }
    labelTranslations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
  end

  factory :questions_sequence, class: 'QuestionsSequences::PredefinedSyndrome' do
    type { 'QuestionsSequences::PredefinedSyndrome' }
    projectId { Project.first.id }
    labelTranslations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
  end

  factory :qs_wrong_variables, class: 'QuestionsSequences::Scored' do
    type { 'QuestionsSequences::Scored' }
    projectId { Project.first.id }
    labelTranslations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
  end

  factory :management, class: 'HealthCares::Management' do
    project_id { Project.first.id }
    label_translations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
    description_translations { { en: Faker::Lorem.paragraph, fr: Faker::Lorem.paragraph } }
    level_of_urgency { Faker::Number.between(from: 1, to: 10) }
  end

  factory :variables_management, class: 'HealthCares::Management' do
    projectId { Project.first.id }
    labelTranslations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
    descriptionTranslations { { en: Faker::Lorem.paragraph, fr: Faker::Lorem.paragraph } }
    levelOfUrgency { Faker::Number.between(from: 1, to: 10) }
  end

  factory :variables_management_invalid, class: 'HealthCares::Management' do
    projectId { Project.first.id }
    labelTranslations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
    descriptionTranslations { { en: Faker::Lorem.paragraph, fr: Faker::Lorem.paragraph } }
    levelOfUrgency { Faker::Number.between(from: 11, to: 14) }
  end
end

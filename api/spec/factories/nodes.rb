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
    nodeComplaintCategoriesAttributes { [] }
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
end

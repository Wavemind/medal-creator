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
    complaintCategoryIds { [] }
    answersAttributes do
      [
        { labelTranslations: { en: 'First answer' }, operator: 'more_or_equal', value: '15' },
        { labelTranslations: { en: 'Second answer' }, operator: 'between', value: '13,15' },
        { labelTranslations: { en: 'Third answer' }, operator: 'less', value: '13' }
      ]
    end
  end

  factory :questions_sequence, class: 'QuestionsSequences::PredefinedSyndrome' do
    type { 'QuestionsSequences::PredefinedSyndrome' }
    project_id { Project.first.id }
    label_translations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
  end

  factory :variable_questions_sequence, class: 'QuestionsSequences::PredefinedSyndrome' do
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

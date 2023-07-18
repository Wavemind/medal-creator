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
    type { 'Exposure' }
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

  factory :drug, class: 'HealthCares::Drug' do
    project_id { Project.first.id }
    label_translations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
    description_translations { { en: Faker::Lorem.paragraph, fr: Faker::Lorem.paragraph } }
    level_of_urgency { Faker::Number.between(from: 1, to: 10) }
  end

  factory :variables_drug, class: 'HealthCares::Drug' do
    projectId { Project.first.id }
    labelTranslations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
    descriptionTranslations { { en: Faker::Lorem.paragraph, fr: Faker::Lorem.paragraph } }
    levelOfUrgency { Faker::Number.between(from: 1, to: 10) }
    isAntibiotic { false }
    isAntiMalarial { false }
    formulationsAttributes do
      [
        { medicationForm: "cream", administrationRouteId: Faker::Number.between(from: 1, to: AdministrationRoute.count),
          uniqueDose: 2.5, dosesPerDay: 2 }
      ]
    end
  end

  factory :variables_drug_invalid, class: 'HealthCares::Drug' do
    projectId { Project.first.id }
    labelTranslations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
    descriptionTranslations { { en: Faker::Lorem.paragraph, fr: Faker::Lorem.paragraph } }
    levelOfUrgency { Faker::Number.between(from: 11, to: 14) }
    isAntibiotic { false }
    isAntiMalarial { false }
    formulationsAttributes do
      [
        { medicationForm: "cream", administrationRouteId: Faker::Number.between(from: 1, to: AdministrationRoute.count),
          uniqueDose: 2.5, dosesPerDay: 2 }
      ]
    end
  end

  factory :variables_drug_invalid_formulation, class: 'HealthCares::Drug' do
    projectId { Project.first.id }
    labelTranslations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
    descriptionTranslations { { en: Faker::Lorem.paragraph, fr: Faker::Lorem.paragraph } }
    levelOfUrgency { Faker::Number.between(from: 1, to: 10) }
    isAntibiotic { false }
    isAntiMalarial { false }
    formulationsAttributes do
      [
        { medicationForm: "capsule", administrationRouteId: Faker::Number.between(from: 1, to: AdministrationRoute.count),
          minimalDosePerKg: 15, maximalDosePerKg: 10, maximalDose: 100, doseForm: 5, dosesPerDay: 2 }
      ]
    end
  end
end

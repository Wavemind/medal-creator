FactoryBot.define do
  factory :complaint_category, class: 'Questions::ComplaintCategory' do
    project { Project.first }
    answer_type { AnswerType.first }
    label_translations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
  end

  factory :question, class: 'Questions::Symptom' do
    project { Project.first }
    answer_type { AnswerType.first }
    label_translations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
  end
end

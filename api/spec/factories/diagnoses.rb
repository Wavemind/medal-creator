FactoryBot.define do
  factory :diagnosis do
    decision_tree_id { DecisionTree.first.id }
    label_translations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
    description_translations { { en: Faker::Lorem.paragraph, fr: Faker::Lorem.paragraph } }
    level_of_urgency { Faker::Number.between(from: 1, to: 10) }
  end

  factory :variables_diagnosis, class: 'Diagnosis' do
    decisionTreeId { DecisionTree.first.id }
    labelTranslations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
    descriptionTranslations { { en: Faker::Lorem.paragraph, fr: Faker::Lorem.paragraph } }
    levelOfUrgency { Faker::Number.between(from: 1, to: 10) }
  end

  factory :variables_diagnosis_invalid, class: 'Diagnosis' do
    decisionTreeId { DecisionTree.first.id }
    labelTranslations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
    descriptionTranslations { { en: Faker::Lorem.paragraph, fr: Faker::Lorem.paragraph } }
    levelOfUrgency { Faker::Number.between(from: 11, to: 14) }
  end
end

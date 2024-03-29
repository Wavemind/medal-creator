FactoryBot.define do
  factory :decision_tree do
    algorithm { Algorithm.first }
    label_translations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
    node { Node.first }
  end

  factory :variables_decision_tree, class: 'DecisionTree' do
    algorithmId { Algorithm.first.id }
    labelTranslations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
    nodeId { Node.first.id }
  end

  # Missing complaint category
  factory :variables_invalid_decision_tree, class: 'DecisionTree' do
    algorithmId { Algorithm.first.id }
    labelTranslations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
  end
end

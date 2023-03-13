FactoryBot.define do
  factory :decision_tree do
    algorithm_id { Algorithm.first.id }
    label_translations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
    node_id { Node.first.id }
  end

  factory :variables_decision_tree, class: 'DecisionTree' do
    algorithmId { Algorithm.first.id }
    labelTranslations { { en: Faker::Lorem.sentence, fr: Faker::Lorem.sentence } }
    nodeId { Node.first.id }
  end
end

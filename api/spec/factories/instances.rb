FactoryBot.define do
  factory :instance do
    node_id { Node.first.id }
    instanceable { Algorithm.first }
  end

  factory :variables_instance, class: 'Instance' do
    nodeId { Node.first.id }
    instanceableId { Algorithm.first.id }
    instanceableType { 'Algorithm' }
    descriptionTranslations { { en: Faker::Lorem.paragraph, fr: Faker::Lorem.paragraph } }
  end

  # TODO: FIX IT
  factory :invalid_instance, class: 'Instance' do
    nodeId { Node.first.id }
    instanceableId { Algorithm.first.id }
    instanceableType { 'Project' }
  end
end

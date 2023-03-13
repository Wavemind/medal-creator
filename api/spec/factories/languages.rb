FactoryBot.define do
  factory :language do
    code { Faker::Address.country_code }
    name { Faker::Address.country_by_code(code: code) }
  end
end

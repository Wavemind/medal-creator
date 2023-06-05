FactoryBot.define do
  factory :project do
    name { Faker::Lorem.sentence }
    consent_management { Faker::Boolean.boolean }
    language_id { Language.find_by(code: 'en').id }
    emergency_content_translations { { en: generate_html_content, fr: generate_html_content } }

    transient do
      user { nil }
    end

    # Create a user and assign it to project, or pass a user with {..., user: User.first }
    after(:create) do |project, evaluator|
      user = evaluator.user || create(:user)
      project.user_projects.create!(user: user, is_admin: Faker::Boolean.boolean)
    end
  end

  factory :variables_project, class: 'Project' do
    name { Faker::Lorem.sentence }
    consentManagement { Faker::Boolean.boolean }
    languageId { Language.find_by(code: 'en').id }
    emergencyContentTranslations { { en: generate_html_content, fr: generate_html_content } }
    userProjectsAttributes { [] }

    trait :with_user_projects do
      userProjectsAttributes do
        [{ userId: create(:user, :clinician).id, isAdmin: Faker::Boolean.boolean },
         { userId: create(:user, :clinician).id, isAdmin: Faker::Boolean.boolean }]
      end
    end
  end

  # Missing default language
  factory :variables_invalid_project, class: 'Project' do
    name { Faker::Lorem.sentence }
    consentManagement { Faker::Boolean.boolean }
    emergencyContentTranslations { { en: generate_html_content, fr: generate_html_content } }
    userProjectsAttributes { [] }
  end
end

def generate_html_content
  html = Nokogiri::HTML::DocumentFragment.parse('')

  # Add title
  title = Faker::Lorem.sentence
  html.add_child("<h1>#{title}</h1>")

  # Add paragraph
  paragraph = Nokogiri::HTML::DocumentFragment.parse("<p>#{Faker::Lorem.paragraph}</p>")
  html.add_child(paragraph)

  # Add list of items
  list = Nokogiri::HTML::DocumentFragment.parse("<ul>#{Faker::Lorem.sentences(number: 3).map do |sentence|
                                                         "<li>#{sentence}</li>"
                                                       end.join('')}</ul>")
  html.add_child(list)

  html.to_html
end

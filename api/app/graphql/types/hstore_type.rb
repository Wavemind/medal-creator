module Types
  class HstoreType < Types::BaseObject
    field :en, String, null: true
    Language.all.each do |language|
      field language.code, String, null: true
    end
  end
end

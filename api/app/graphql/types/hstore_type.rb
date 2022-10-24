module Types
  class HstoreType < Types::BaseObject
    field :en, String
    Language.all.each do |language|
      field language.code, String
    end
  end
end

module Types
  class HstoreType < Types::BaseObject
    Language.all.each do |language|
      field language.code, String, null: false
    end
  end
end

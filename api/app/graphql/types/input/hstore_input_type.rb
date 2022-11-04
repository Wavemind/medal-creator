module Types
  module Input
    class HstoreInputType < Types::BaseInputObject
      Language.all.each do |language|
        argument language.code, String, required: false
      end
    end
  end
end

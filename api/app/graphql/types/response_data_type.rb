module Types
  class ResponseDataType < Types::BaseObject
    field :success, Boolean, null: false
    field :url, String, null: true
  end
end

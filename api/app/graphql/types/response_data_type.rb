module Types
  class ResponseDataType < Types::BaseObject
    field :success, Boolean, null: false
    field :data, String, null: true
  end
end

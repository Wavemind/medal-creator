module Types
  class MutationType < Types::BaseObject
    field :create_user, mutation: Mutations::Users::CreateUser
    field :update_user, mutation: Mutations::Users::UpdateUser
    field :create_algorithm, mutation: Mutations::Users::CreateAlgorithm
    field :update_algorithm, mutation: Mutations::Users::UpdateAlgorithm
  end
end

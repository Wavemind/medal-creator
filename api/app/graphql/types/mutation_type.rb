module Types
  class MutationType < Types::BaseObject
    field :create_user, mutation: Mutations::Users::CreateUser
    field :update_user, mutation: Mutations::Users::UpdateUser
    field :create_project, mutation: Mutations::Projects::CreateProject
    field :update_project, mutation: Mutations::Projects::UpdateProject
    field :create_algorithm, mutation: Mutations::Algorithms::CreateAlgorithm
    field :update_algorithm, mutation: Mutations::Algorithms::UpdateAlgorithm
  end
end

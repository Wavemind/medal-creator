module Types
  class MutationType < Types::BaseObject
    field :create_user, mutation: Mutations::Users::CreateUser
    field :update_user, mutation: Mutations::Users::UpdateUser
    field :accept_invitation, mutation: Mutations::Users::AcceptInvitation
    field :create_project, mutation: Mutations::Projects::CreateProject
    field :update_project, mutation: Mutations::Projects::UpdateProject
    field :unsubscribe_from_project, mutation: Mutations::Projects::UnsubscribeFromProject
    field :create_algorithm, mutation: Mutations::Algorithms::CreateAlgorithm
    field :update_algorithm, mutation: Mutations::Algorithms::UpdateAlgorithm
    field :destroy_algorithm, mutation: Mutations::Algorithms::DestroyAlgorithm
  end
end

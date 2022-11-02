module Types
  class MutationType < Types::BaseObject
    field :update_user, mutation: Mutations::Users::UpdateUser
    field :create_user, mutation: Mutations::Users::CreateUser
    field :create_project, mutation: Mutations::Projects::CreateProject
  end
end

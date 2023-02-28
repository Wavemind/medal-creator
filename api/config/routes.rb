Rails.application.routes.draw do
  root to: proc { [404, {}, ['<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">control panel</a>']] }

  use_doorkeeper

  namespace :api, defaults: { format: 'json' } do
    namespace :v1 do
      devise_for :users, path: 'auth', only: [:invitations], controllers: { invitations: 'api/v1/users_invitations' }
    end
  end

  post '/graphql', to: 'graphql#execute'
  mount GraphiQL::Rails::Engine, at: '/graphiql', graphql_path: 'graphql#execute' if Rails.env.development?
end

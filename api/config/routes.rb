Rails.application.routes.draw do
  root to: proc { [404, {}, ['<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">control panel</a>']] }

  namespace :api, defaults: { format: 'json' } do
    namespace :v1 do
      mount_devise_token_auth_for 'User', at: 'auth', skip: [:invitations], controllers: {
        sessions: 'api/v1/overrides/sessions'
      }
      devise_for :users, path: 'auth', only: [:invitations], controllers: { invitations: 'api/v1/users_invitations' }

      resources :algorithms, only: [:index, :show] do
        member do
          get 'medal_data_config', to: 'algorithms#medal_data_config'
        end
      end
      resources :projects, only: [:index] do
        member do
          get 'emergency_content'
          post 'emergency_content'
        end
      end
    end
  end

  post '/graphql', to: 'graphql#execute'
  mount GraphiQL::Rails::Engine, at: '/graphiql', graphql_path: 'graphql#execute' if Rails.env.development?
end

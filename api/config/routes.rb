Rails.application.routes.draw do
  root to: proc { [404, {}, ['<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">control panel</a>']] }

  namespace :api, defaults: { format: 'json' } do
    namespace :v1 do
      get 'versions/:id', to: 'algorithms#show'
      get 'versions/:version_id/medal_data_config', to: 'algorithms#medal_data_config' # Versions meaning Algorithm
      post 'algorithms/:id/emergency_content', to: 'projects#emergency_content' # Algorithms meaning Project
      get 'algorithms/:id/versions', to: 'algorithms#index'
      get 'algorithms', to: 'projects#index'
    end

    namespace :v2, defaults: { format: 'json' } do
      mount_devise_token_auth_for 'User', at: 'auth', skip: [:invitations], controllers: {
        sessions: 'api/v2/overrides/sessions'
      }
      devise_for :users, path: 'auth', only: [:invitations], controllers: { invitations: 'api/v2/users_invitations' }

      resources :algorithms, only: [:show] do
        member do
          get 'medal_data_config', to: 'algorithms#medal_data_config'
        end
      end
      resources :projects, only: [:index] do
        resources :algorithms, only: [:index]
        member do
          post 'emergency_content'
        end
      end
    end
  end

  post '/graphql', to: 'graphql#execute'
  mount GraphiQL::Rails::Engine, at: '/graphiql', graphql_path: 'graphql#execute' if Rails.env.development?
end

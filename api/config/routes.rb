Rails.application.routes.draw do
  root to: proc { [404, {}, ['<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">control panel</a>']] }

  namespace :api, defaults: { format: 'json' } do
    namespace :v1 do
      resources :algorithms, only: [:index] do
        member do
          post 'emergency_content'
        end
        resources :versions, only: [:index]
      end
      resources :versions, only: [:show] do
        get 'json_test', to: 'versions#json_test'
        collection do
          post 'retrieve_algorithm_version', to: 'versions#retrieve_algorithm_version'
          get 'json_from_facility', to: 'versions#json_from_facility'
          get 'facility_attributes', to: 'versions#facility_attributes'
          get 'medal_data_config', to: 'versions#medal_data_config'
        end
      end
      resources :devices, only: [:show]
      resources :devices, only: [:create]

      get 'is_available', to: 'application#is_available'
      get 'categories', to: 'application#categories'

      resources :health_facilities, only: [:show] do
        collection do
          get 'get_from_study', to: 'health_facilities#get_from_study'
        end
      end
    end

    namespace :v2 do
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
          get 'emergency_content'
          post 'emergency_content'
        end
      end
    end
  end


  post '/graphql', to: 'graphql#execute'
  mount GraphiQL::Rails::Engine, at: '/graphiql', graphql_path: 'graphql#execute' if Rails.env.development?
end

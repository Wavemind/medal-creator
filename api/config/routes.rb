Rails.application.routes.draw do
  namespace :api, defaults: { format: 'json' } do
    namespace :v1 do
      mount_devise_token_auth_for 'User', at: 'auth', controllers: {
        sessions: 'api/v1/overrides/sessions'
      }
      if Rails.env.development?
        mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "graphql#execute"
      end
      post "/graphql", to: "graphql#execute"

      namespace :webauthn do
        resources :credentials, only: %i[index create destroy]
        resources :challenges, only: %i[create]
        resources :authentications, only: %i[create]
      end
    end
  end
end

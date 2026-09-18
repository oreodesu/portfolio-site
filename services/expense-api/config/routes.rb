Rails.application.routes.draw do
  get "/healthz", to: proc { [200, {}, ["ok"]] }

  namespace :api do
    namespace :v1 do
      post "signup", to: "users#create"
      post "login", to: "sessions#create"
      get "me", to: "sessions#show"

      resources :categories, only: %i[index create destroy]
      resources :expenses, only: %i[index create update destroy] do
        collection do
          get :summary
        end
      end
    end
  end
end

module Api
  module V1
    class UsersController < ApplicationController
      # サインアップ
      def create
        user = User.create!(user_params)

        render json: {
          token: JsonWebToken.encode(user.id),
          user: { id: user.id, email: user.email }
        }, status: :created
      end

      private

      def user_params
        params.require(:user).permit(:email, :password)
      end
    end
  end
end

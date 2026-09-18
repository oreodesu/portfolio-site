module Api
  module V1
    class SessionsController < ApplicationController
      before_action :authenticate_user!, only: :show

      # ログイン
      def create
        user = User.find_by(email: params[:email].to_s.strip.downcase)

        # メールアドレスの存在有無を区別せず、同じメッセージを返す
        unless user&.authenticate(params[:password].to_s)
          return render json: { error: "メールアドレスまたはパスワードが違います" }, status: :unauthorized
        end

        render json: {
          token: JsonWebToken.encode(user.id),
          user: { id: user.id, email: user.email }
        }
      end

      # ログイン中のユーザー情報 (トークンの有効性確認にも使う)
      def show
        render json: { user: { id: current_user.id, email: current_user.email } }
      end
    end
  end
end

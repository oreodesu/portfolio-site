module Api
  module V1
    class CategoriesController < ApplicationController
      before_action :authenticate_user!

      def index
        render json: current_user.categories.order(:name)
      end

      def create
        category = current_user.categories.create!(category_params)
        render json: category, status: :created
      end

      def destroy
        category = current_user.categories.find(params[:id])

        # モデル側の dependent: :restrict_with_error でも防げるが、
        # 画面に出す理由を明確にするため、ここで先に判定して専用のメッセージを返す
        if category.expenses.exists?
          return render json: { error: ["このカテゴリを使っている支出があるため削除できません"] },
                        status: :unprocessable_content
        end

        category.destroy!
        head :no_content
      end

      private

      def category_params
        params.require(:category).permit(:name)
      end
    end
  end
end

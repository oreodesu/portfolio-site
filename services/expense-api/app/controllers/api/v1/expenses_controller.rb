module Api
  module V1
    class ExpensesController < ApplicationController
      before_action :authenticate_user!

      def index
        expenses = current_user.expenses.includes(:category).order(spent_on: :desc)
        render json: expenses.as_json(include: { category: { only: %i[id name] } })
      end

      def create
        expense = current_user.expenses.create!(expense_params)
        render json: expense.as_json(include: { category: { only: %i[id name] } }), status: :created
      end

      def update
        expense = current_user.expenses.find(params[:id])
        expense.update!(expense_params)
        render json: expense.as_json(include: { category: { only: %i[id name] } })
      end

      def destroy
        current_user.expenses.find(params[:id]).destroy!
        head :no_content
      end

      # カテゴリ別・指定月の集計
      def summary
        year = params.fetch(:year, Date.current.year).to_i
        month = params.fetch(:month, Date.current.month).to_i

        totals = current_user.expenses
                             .for_month(year, month)
                             .joins(:category)
                             .group("categories.name")
                             .sum(:amount)

        render json: { year: year, month: month, totals: totals }
      end

      private

      def expense_params
        params.require(:expense).permit(:category_id, :amount, :spent_on, :memo)
      end
    end
  end
end

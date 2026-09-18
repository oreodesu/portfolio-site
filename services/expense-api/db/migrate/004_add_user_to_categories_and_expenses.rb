class AddUserToCategoriesAndExpenses < ActiveRecord::Migration[7.2]
  def change
    add_reference :categories, :user, null: false, foreign_key: true
    add_reference :expenses, :user, null: false, foreign_key: true

    # カテゴリ名の一意性はアプリ全体ではなくユーザー単位で担保する
    remove_index :categories, :name
    add_index :categories, %i[user_id name], unique: true
  end
end

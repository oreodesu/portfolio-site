class CreateExpenses < ActiveRecord::Migration[7.1]
  def change
    create_table :expenses do |t|
      t.references :category, null: false, foreign_key: true
      t.decimal :amount, precision: 10, scale: 2, null: false
      t.date :spent_on, null: false
      t.string :memo, limit: 200

      t.timestamps
    end

    add_index :expenses, :spent_on
  end
end

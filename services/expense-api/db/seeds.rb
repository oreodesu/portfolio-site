# 「デモアカウントで試す」ボタンから誰でも中身を確認できるようにするためのデータ。
# 何度実行しても同じ状態になるよう、find_or_create_by で冪等にしている。
DEMO_EMAIL = "demo@example.com".freeze
DEMO_PASSWORD = "demopassword".freeze

demo = User.find_or_initialize_by(email: DEMO_EMAIL)
demo.password = DEMO_PASSWORD
demo.save!

sample = {
  "食費" => [[1_200, "ランチ"], [3_400, "スーパーで買い出し"]],
  "交通費" => [[520, "電車代"]],
  "趣味" => [[2_800, "書籍"]]
}

sample.each do |category_name, rows|
  category = demo.categories.find_or_create_by!(name: category_name)

  rows.each_with_index do |(amount, memo), index|
    demo.expenses.find_or_create_by!(category: category, memo: memo) do |expense|
      expense.amount = amount
      expense.spent_on = Date.current - index
    end
  end
end

puts "Seeded demo user: #{DEMO_EMAIL} / #{DEMO_PASSWORD}"

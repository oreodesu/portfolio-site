FactoryBot.define do
  factory :expense do
    user
    # 明示しない限り、支出と同じユーザーが持つカテゴリを紐づける
    category { association :category, user: user }
    amount { 1_000 }
    spent_on { Date.current }
    memo { "テスト用の支出" }
  end
end

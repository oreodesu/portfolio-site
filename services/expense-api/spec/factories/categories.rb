FactoryBot.define do
  factory :category do
    user
    sequence(:name) { |n| "カテゴリ#{n}" }
  end
end

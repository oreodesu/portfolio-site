require "rails_helper"

RSpec.describe Expense, type: :model do
  let(:user) { create(:user) }

  describe "バリデーション" do
    it "ユーザー・カテゴリ・金額・日付が揃っていれば有効" do
      expect(build(:expense, user: user)).to be_valid
    end

    it "ユーザーが無ければ無効" do
      expect(build(:expense, user: nil)).not_to be_valid
    end

    it "カテゴリが無ければ無効" do
      expect(build(:expense, user: user, category: nil)).not_to be_valid
    end

    it "金額が無ければ無効" do
      expect(build(:expense, user: user, amount: nil)).not_to be_valid
    end

    it "金額が0以下なら無効" do
      expect(build(:expense, user: user, amount: 0)).not_to be_valid
      expect(build(:expense, user: user, amount: -100)).not_to be_valid
    end

    it "日付が無ければ無効" do
      expect(build(:expense, user: user, spent_on: nil)).not_to be_valid
    end

    it "メモが200文字を超えると無効" do
      expect(build(:expense, user: user, memo: "あ" * 200)).to be_valid
      expect(build(:expense, user: user, memo: "あ" * 201)).not_to be_valid
    end

    it "メモは任意" do
      expect(build(:expense, user: user, memo: nil)).to be_valid
    end

    it "他人のカテゴリは紐づけられない" do
      others_category = create(:category, user: create(:user))
      expense = build(:expense, user: user, category: others_category)

      expect(expense).not_to be_valid
      expect(expense.errors[:category]).to be_present
    end
  end

  describe ".for_month" do
    let(:category) { create(:category, user: user) }

    before do
      create(:expense, user: user, category: category, spent_on: Date.new(2026, 3, 1))
      create(:expense, user: user, category: category, spent_on: Date.new(2026, 3, 31))
      create(:expense, user: user, category: category, spent_on: Date.new(2026, 2, 28))
      create(:expense, user: user, category: category, spent_on: Date.new(2026, 4, 1))
    end

    it "指定した月の支出だけを返す" do
      results = Expense.for_month(2026, 3)

      expect(results.count).to eq 2
      expect(results.map(&:spent_on)).to contain_exactly(Date.new(2026, 3, 1), Date.new(2026, 3, 31))
    end

    it "月末が30日の月でも正しく範囲を取る" do
      create(:expense, user: user, category: category, spent_on: Date.new(2026, 4, 30))

      expect(Expense.for_month(2026, 4).count).to eq 2
    end
  end
end

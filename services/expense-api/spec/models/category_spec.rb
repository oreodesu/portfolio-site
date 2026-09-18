require "rails_helper"

RSpec.describe Category, type: :model do
  let(:user) { create(:user) }

  describe "バリデーション" do
    it "名前があれば有効" do
      expect(build(:category, user: user, name: "食費")).to be_valid
    end

    it "名前が無ければ無効" do
      category = build(:category, user: user, name: nil)

      expect(category).not_to be_valid
      expect(category.errors[:name]).to be_present
    end

    it "ユーザーが無ければ無効" do
      expect(build(:category, user: nil)).not_to be_valid
    end

    it "同じユーザー内では同じ名前のカテゴリを登録できない" do
      create(:category, user: user, name: "食費")
      duplicated = build(:category, user: user, name: "食費")

      expect(duplicated).not_to be_valid
      expect(duplicated.errors[:name]).to be_present
    end

    it "ユーザーが違えば同じ名前のカテゴリを登録できる" do
      create(:category, user: user, name: "食費")

      expect(build(:category, user: create(:user), name: "食費")).to be_valid
    end
  end

  describe "#expenses" do
    it "紐づく支出がある場合は削除できない" do
      category = create(:category, user: user)
      create(:expense, user: user, category: category)

      expect(category.destroy).to be_falsey
      expect(Category.exists?(category.id)).to be true
    end

    it "紐づく支出が無ければ削除できる" do
      category = create(:category, user: user)

      expect(category.destroy).to be_truthy
      expect(Category.exists?(category.id)).to be false
    end
  end
end

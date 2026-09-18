require "rails_helper"

RSpec.describe User, type: :model do
  describe "バリデーション" do
    it "メールアドレスとパスワードがあれば有効" do
      expect(build(:user)).to be_valid
    end

    it "メールアドレスが無ければ無効" do
      expect(build(:user, email: nil)).not_to be_valid
    end

    it "メールアドレスの形式が不正なら無効" do
      expect(build(:user, email: "not-an-email")).not_to be_valid
    end

    it "大文字・空白の違いを無視して重複を検出する" do
      create(:user, email: "user@example.com")

      expect(build(:user, email: "  USER@example.com  ")).not_to be_valid
    end

    it "パスワードが8文字未満なら無効" do
      expect(build(:user, password: "short")).not_to be_valid
    end
  end

  describe "#authenticate" do
    let(:user) { create(:user, password: "password123") }

    it "正しいパスワードなら本人を返す" do
      expect(user.authenticate("password123")).to eq user
    end

    it "誤ったパスワードなら false を返す" do
      expect(user.authenticate("wrongpassword")).to be false
    end

    it "パスワードは平文で保存されない" do
      expect(user.password_digest).not_to eq "password123"
      expect(user.password_digest).to be_present
    end
  end

  describe "関連" do
    it "ユーザーを削除すると、そのユーザーのカテゴリと支出も削除される" do
      user = create(:user)
      create(:expense, user: user)

      expect { user.destroy! }.to change(Expense, :count).by(-1).and change(Category, :count).by(-1)
    end
  end
end

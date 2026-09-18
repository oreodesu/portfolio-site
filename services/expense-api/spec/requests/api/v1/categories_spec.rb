require "rails_helper"

RSpec.describe "Api::V1::Categories", type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }

  describe "GET /api/v1/categories" do
    it "ログインしていなければ401を返す" do
      get "/api/v1/categories"

      expect(response).to have_http_status(:unauthorized)
    end

    it "自分のカテゴリを名前順で返す" do
      create(:category, user: user, name: "日用品")
      create(:category, user: user, name: "交通費")

      get "/api/v1/categories", headers: headers

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body.map { |c| c["name"] }).to eq %w[交通費 日用品]
    end

    it "他人のカテゴリは返さない" do
      create(:category, user: user, name: "自分の分")
      create(:category, user: create(:user), name: "他人の分")

      get "/api/v1/categories", headers: headers

      expect(response.parsed_body.map { |c| c["name"] }).to eq %w[自分の分]
    end

    it "1件も無い場合は空配列を返す" do
      get "/api/v1/categories", headers: headers

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to eq []
    end
  end

  describe "POST /api/v1/categories" do
    it "ログインしていなければ401を返す" do
      post "/api/v1/categories", params: { category: { name: "食費" } }

      expect(response).to have_http_status(:unauthorized)
    end

    it "ログイン中のユーザーのカテゴリとして作成する" do
      expect {
        post "/api/v1/categories", params: { category: { name: "食費" } }, headers: headers
      }.to change(user.categories, :count).by(1)

      expect(response).to have_http_status(:created)
      expect(response.parsed_body["name"]).to eq "食費"
    end

    it "名前が空なら422を返す" do
      post "/api/v1/categories", params: { category: { name: "" } }, headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      expect(response.parsed_body["error"]).to be_present
    end

    it "自分の中で重複する名前なら422を返す" do
      create(:category, user: user, name: "食費")

      post "/api/v1/categories", params: { category: { name: "食費" } }, headers: headers

      expect(response).to have_http_status(:unprocessable_content)
    end

    it "他人が同じ名前を使っていても作成できる" do
      create(:category, user: create(:user), name: "食費")

      post "/api/v1/categories", params: { category: { name: "食費" } }, headers: headers

      expect(response).to have_http_status(:created)
    end
  end

  describe "DELETE /api/v1/categories/:id" do
    it "ログインしていなければ401を返す" do
      category = create(:category, user: user)

      delete "/api/v1/categories/#{category.id}"

      expect(response).to have_http_status(:unauthorized)
    end

    it "使われていないカテゴリは削除できる" do
      category = create(:category, user: user)

      expect {
        delete "/api/v1/categories/#{category.id}", headers: headers
      }.to change(Category, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it "支出で使われているカテゴリは削除できず、理由を返す" do
      category = create(:category, user: user)
      create(:expense, user: user, category: category)

      expect {
        delete "/api/v1/categories/#{category.id}", headers: headers
      }.not_to change(Category, :count)

      expect(response).to have_http_status(:unprocessable_content)
      expect(response.parsed_body["error"].join).to include("支出があるため")
    end

    it "他人のカテゴリは削除できず404を返す" do
      others_category = create(:category, user: create(:user))

      expect {
        delete "/api/v1/categories/#{others_category.id}", headers: headers
      }.not_to change(Category, :count)

      expect(response).to have_http_status(:not_found)
    end
  end
end

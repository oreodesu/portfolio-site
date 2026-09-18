require "rails_helper"

RSpec.describe "Api::V1 認証", type: :request do
  describe "POST /api/v1/signup" do
    it "ユーザーを作成し、トークンを返す" do
      expect {
        post "/api/v1/signup", params: { user: { email: "new@example.com", password: "password123" } }
      }.to change(User, :count).by(1)

      expect(response).to have_http_status(:created)
      expect(response.parsed_body["token"]).to be_present
      expect(response.parsed_body["user"]).to include("email" => "new@example.com")
    end

    it "返されたトークンでそのまま認証できる" do
      post "/api/v1/signup", params: { user: { email: "new@example.com", password: "password123" } }
      token = response.parsed_body["token"]

      get "/api/v1/me", headers: { "Authorization" => "Bearer #{token}" }

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["user"]["email"]).to eq "new@example.com"
    end

    it "レスポンスにパスワード関連の値を含めない" do
      post "/api/v1/signup", params: { user: { email: "new@example.com", password: "password123" } }

      expect(response.parsed_body["user"].keys).to contain_exactly("id", "email")
    end

    it "メールアドレスが重複していれば422を返す" do
      create(:user, email: "taken@example.com")

      post "/api/v1/signup", params: { user: { email: "taken@example.com", password: "password123" } }

      expect(response).to have_http_status(:unprocessable_content)
    end

    it "パスワードが短ければ422を返す" do
      post "/api/v1/signup", params: { user: { email: "new@example.com", password: "short" } }

      expect(response).to have_http_status(:unprocessable_content)
    end
  end

  describe "POST /api/v1/login" do
    let!(:user) { create(:user, email: "user@example.com", password: "password123") }

    it "正しい認証情報ならトークンを返す" do
      post "/api/v1/login", params: { email: "user@example.com", password: "password123" }

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["token"]).to be_present
    end

    it "メールアドレスの大文字・空白の違いを吸収する" do
      post "/api/v1/login", params: { email: "  USER@example.com  ", password: "password123" }

      expect(response).to have_http_status(:ok)
    end

    it "パスワードが違えば401を返す" do
      post "/api/v1/login", params: { email: "user@example.com", password: "wrongpassword" }

      expect(response).to have_http_status(:unauthorized)
    end

    it "存在しないメールアドレスでも、パスワード誤りと同じ応答を返す" do
      post "/api/v1/login", params: { email: "nobody@example.com", password: "password123" }
      body_for_unknown_email = response.parsed_body

      post "/api/v1/login", params: { email: "user@example.com", password: "wrongpassword" }

      # アカウントの存在有無を推測されないよう、応答を区別しない
      expect(response.parsed_body).to eq body_for_unknown_email
    end
  end

  describe "GET /api/v1/me" do
    it "トークンが無ければ401を返す" do
      get "/api/v1/me"

      expect(response).to have_http_status(:unauthorized)
    end

    it "改ざんされたトークンなら401を返す" do
      get "/api/v1/me", headers: { "Authorization" => "Bearer not.a.token" }

      expect(response).to have_http_status(:unauthorized)
    end

    it "期限切れのトークンなら401を返す" do
      user = create(:user)
      expired = travel_to(2.days.ago) { JsonWebToken.encode(user.id) }

      get "/api/v1/me", headers: { "Authorization" => "Bearer #{expired}" }

      expect(response).to have_http_status(:unauthorized)
    end
  end
end

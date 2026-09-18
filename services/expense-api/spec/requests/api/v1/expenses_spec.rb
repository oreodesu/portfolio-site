require "rails_helper"

RSpec.describe "Api::V1::Expenses", type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }
  let(:category) { create(:category, user: user, name: "食費") }

  describe "GET /api/v1/expenses" do
    it "ログインしていなければ401を返す" do
      get "/api/v1/expenses"

      expect(response).to have_http_status(:unauthorized)
    end

    it "支出を日付の新しい順に返す" do
      create(:expense, user: user, category: category, spent_on: Date.new(2026, 1, 1))
      create(:expense, user: user, category: category, spent_on: Date.new(2026, 3, 1))

      get "/api/v1/expenses", headers: headers

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body.map { |e| e["spent_on"] }).to eq %w[2026-03-01 2026-01-01]
    end

    it "他人の支出は返さない" do
      create(:expense, user: user, category: category, memo: "自分の分")
      create(:expense, user: create(:user), memo: "他人の分")

      get "/api/v1/expenses", headers: headers

      expect(response.parsed_body.map { |e| e["memo"] }).to eq %w[自分の分]
    end

    it "カテゴリ情報を含めて返す" do
      create(:expense, user: user, category: category)

      get "/api/v1/expenses", headers: headers

      expect(response.parsed_body.first["category"]).to include("id" => category.id, "name" => "食費")
    end
  end

  describe "POST /api/v1/expenses" do
    let(:valid_params) do
      { expense: { category_id: category.id, amount: 1_200, spent_on: "2026-03-01", memo: "ランチ" } }
    end

    it "ログインしていなければ401を返す" do
      post "/api/v1/expenses", params: valid_params

      expect(response).to have_http_status(:unauthorized)
    end

    it "支出を登録する" do
      expect {
        post "/api/v1/expenses", params: valid_params, headers: headers
      }.to change(user.expenses, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    # フロントエンドは登録直後のレスポンスをそのまま一覧に差し込むため、
    # category を含めないと画面側で参照エラーになる
    it "レスポンスにカテゴリ情報を含める" do
      post "/api/v1/expenses", params: valid_params, headers: headers

      expect(response.parsed_body["category"]).to include("id" => category.id, "name" => "食費")
    end

    it "金額が0なら422を返す" do
      post "/api/v1/expenses",
           params: { expense: { category_id: category.id, amount: 0, spent_on: "2026-03-01" } },
           headers: headers

      expect(response).to have_http_status(:unprocessable_content)
    end

    it "カテゴリが存在しなければ422を返す" do
      post "/api/v1/expenses",
           params: { expense: { category_id: 0, amount: 100, spent_on: "2026-03-01" } },
           headers: headers

      expect(response).to have_http_status(:unprocessable_content)
    end

    it "他人のカテゴリを指定しても登録できない" do
      others_category = create(:category, user: create(:user))

      post "/api/v1/expenses",
           params: { expense: { category_id: others_category.id, amount: 100, spent_on: "2026-03-01" } },
           headers: headers

      expect(response).to have_http_status(:unprocessable_content)
    end
  end

  describe "PATCH /api/v1/expenses/:id" do
    it "支出を更新し、カテゴリ情報を含めて返す" do
      expense = create(:expense, user: user, category: category, amount: 1_000)
      other_category = create(:category, user: user, name: "交通費")

      patch "/api/v1/expenses/#{expense.id}",
            params: { expense: { category_id: other_category.id, amount: 3_000, spent_on: "2026-03-05" } },
            headers: headers

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["category"]).to include("name" => "交通費")
      expect(expense.reload.amount).to eq 3_000
    end

    it "存在しないIDなら404を返す" do
      patch "/api/v1/expenses/0", params: { expense: { amount: 100 } }, headers: headers

      expect(response).to have_http_status(:not_found)
    end

    it "他人の支出は更新できず404を返す" do
      others_expense = create(:expense, user: create(:user))

      patch "/api/v1/expenses/#{others_expense.id}",
            params: { expense: { amount: 9_999 } },
            headers: headers

      expect(response).to have_http_status(:not_found)
      expect(others_expense.reload.amount).not_to eq 9_999
    end
  end

  describe "DELETE /api/v1/expenses/:id" do
    it "支出を削除する" do
      expense = create(:expense, user: user, category: category)

      expect {
        delete "/api/v1/expenses/#{expense.id}", headers: headers
      }.to change(Expense, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it "存在しないIDなら404を返す" do
      delete "/api/v1/expenses/0", headers: headers

      expect(response).to have_http_status(:not_found)
    end

    it "他人の支出は削除できず404を返す" do
      others_expense = create(:expense, user: create(:user))

      expect {
        delete "/api/v1/expenses/#{others_expense.id}", headers: headers
      }.not_to change(Expense, :count)

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "GET /api/v1/expenses/summary" do
    it "指定した月のカテゴリ別合計を返す" do
      transport = create(:category, user: user, name: "交通費")
      create(:expense, user: user, category: category, amount: 1_000, spent_on: Date.new(2026, 3, 1))
      create(:expense, user: user, category: category, amount: 500, spent_on: Date.new(2026, 3, 20))
      create(:expense, user: user, category: transport, amount: 300, spent_on: Date.new(2026, 3, 10))
      create(:expense, user: user, category: category, amount: 9_999, spent_on: Date.new(2026, 2, 1))

      get "/api/v1/expenses/summary", params: { year: 2026, month: 3 }, headers: headers

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to include(
        "year" => 2026,
        "month" => 3,
        "totals" => { "食費" => "1500.0", "交通費" => "300.0" }
      )
    end

    it "他人の支出は集計に含めない" do
      create(:expense, user: user, category: category, amount: 1_000, spent_on: Date.new(2026, 3, 1))
      create(:expense, user: create(:user), amount: 5_000, spent_on: Date.new(2026, 3, 1))

      get "/api/v1/expenses/summary", params: { year: 2026, month: 3 }, headers: headers

      expect(response.parsed_body["totals"].values.sum(&:to_d)).to eq 1_000
    end
  end
end

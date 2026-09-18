class User < ApplicationRecord
  has_secure_password

  # カテゴリは支出が残っていると削除できない (restrict_with_error) ため、
  # 支出を先に削除する必要がある。関連の宣言順がそのまま削除順になる。
  has_many :expenses, dependent: :destroy
  has_many :categories, dependent: :destroy

  normalizes :email, with: ->(email) { email.to_s.strip.downcase }

  validates :email,
            presence: true,
            uniqueness: { case_sensitive: false },
            format: { with: URI::MailTo::EMAIL_REGEXP }
  # has_secure_password が新規作成時の存在チェックを行うため、ここでは長さのみ検証する
  validates :password, length: { minimum: 8 }, allow_nil: true
end

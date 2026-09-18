class Expense < ApplicationRecord
  belongs_to :user
  belongs_to :category

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :spent_on, presence: true
  validates :memo, length: { maximum: 200 }

  # user_id を支出にも持たせているため、カテゴリの持ち主とずれないことを保証する
  validate :category_must_belong_to_same_user

  scope :for_month, ->(year, month) {
    where(spent_on: Date.new(year, month, 1)..Date.new(year, month, -1))
  }

  private

  def category_must_belong_to_same_user
    return if category.nil? || user_id.nil?
    return if category.user_id == user_id

    errors.add(:category, "は自分が作成したものを選んでください")
  end
end

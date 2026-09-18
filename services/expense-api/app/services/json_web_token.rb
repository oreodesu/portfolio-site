class JsonWebToken
  ALGORITHM = "HS256".freeze
  EXPIRATION = 24.hours

  class << self
    def encode(user_id)
      payload = { user_id: user_id, exp: EXPIRATION.from_now.to_i }
      JWT.encode(payload, secret, ALGORITHM)
    end

    # 改ざん・期限切れ・形式不正はすべて nil を返し、呼び出し側では未認証として扱う
    def decode(token)
      return nil if token.blank?

      payload, = JWT.decode(token, secret, true, algorithm: ALGORITHM)
      payload.symbolize_keys
    rescue JWT::DecodeError
      nil
    end

    private

    def secret
      Rails.application.secret_key_base
    end
  end
end

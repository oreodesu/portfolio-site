module AuthHelpers
  def auth_headers(user)
    { "Authorization" => "Bearer #{JsonWebToken.encode(user.id)}" }
  end
end

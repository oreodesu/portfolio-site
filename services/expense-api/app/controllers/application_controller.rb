class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable

  private

  def authenticate_user!
    render_unauthorized if current_user.nil?
  end

  def current_user
    return @current_user if defined?(@current_user)

    payload = JsonWebToken.decode(bearer_token)
    @current_user = payload && User.find_by(id: payload[:user_id])
  end

  def bearer_token
    request.headers["Authorization"].to_s.split(" ").last
  end

  def render_unauthorized
    render json: { error: "ログインが必要です" }, status: :unauthorized
  end

  def render_not_found
    render json: { error: "not found" }, status: :not_found
  end

  def render_unprocessable(exception)
    render json: { error: exception.record.errors.full_messages }, status: :unprocessable_content
  end
end

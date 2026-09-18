Rails.application.configure do
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local = false
  config.log_level = :info
  config.log_tags = [:request_id]
  config.force_ssl = false # EC2 + nginx構成で、TLS終端をnginx側に置くため false のままにしている

  # 暗号化credentials(master.key)は使わず、他のサービスと同様に環境変数で渡す方式に統一
  config.secret_key_base = ENV.fetch("SECRET_KEY_BASE")
end

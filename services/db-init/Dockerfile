FROM mysql:8.0

# ホスト側のファイルに実行権限が付いていなくても確実に動くよう、
# ビルド時にchmodしてイメージに焼き込む
COPY 01_create_databases.sh /docker-entrypoint-initdb.d/01_create_databases.sh
RUN chmod +x /docker-entrypoint-initdb.d/01_create_databases.sh

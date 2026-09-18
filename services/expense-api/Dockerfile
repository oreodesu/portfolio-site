FROM ruby:3.3-slim

RUN apt-get update -qq && apt-get install -y --no-install-recommends \
    build-essential default-libmysqlclient-dev pkg-config git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
# Gemfile.lock も一緒にコピーしてから install することで、
# ロックファイルどおりのバージョンが入ることを保証する (再現性のあるビルド)
COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .
RUN chmod +x bin/rails && mkdir -p tmp/pids tmp/cache tmp/sockets log

EXPOSE 3000
ENV RAILS_LOG_TO_STDOUT=true
# 起動のたびにマイグレーションとseedを実行してからサーバーを起動する。
# db:prepare はDBを新規作成した時しかseedを流さないが、DB自体は services/db-init が
# 先に作るため常に「既存DB」扱いになる。そのため db:seed を明示的に実行している
# (seeds.rb は冪等なので毎回実行しても問題ない)。
CMD ["sh", "-c", "./bin/rails db:prepare && ./bin/rails db:seed && bundle exec puma -C config/puma.rb"]

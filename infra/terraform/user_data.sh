#!/bin/bash
# EC2初回起動時にDockerとDocker Composeプラグインだけをセットアップする。
# アプリ本体のデプロイ (git clone / docker compose up) はここでは行わず、
# GitHub Actions (deploy.yml) からSSH経由で行う想定。
set -euxo pipefail

dnf update -y
dnf install -y docker git

systemctl enable docker
systemctl start docker
usermod -aG docker ec2-user

DOCKER_COMPOSE_VERSION="v2.29.2"
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-linux-x86_64" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

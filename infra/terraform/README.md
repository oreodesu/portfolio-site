# infra/terraform

コスト最小構成: **EC2インスタンス1台 + セキュリティグループ**のみ。デフォルトVPCを利用し、RDSやNAT Gateway、Elastic IPなど追加課金要素になり得るリソースはあえて作成していません。

## 構成ファイル

| ファイル                   | 内容                                                                |
| -------------------------- | ------------------------------------------------------------------- |
| `provider.tf`              | Terraform/AWSプロバイダのバージョン指定。バックエンドは当面ローカル |
| `variables.tf`             | 変数定義 (リージョン、インスタンスタイプ、SSH許可IPなど)            |
| `network.tf`               | デフォルトVPC参照 + セキュリティグループ (22/80/443)                |
| `ec2.tf`                   | EC2インスタンス本体 (Amazon Linux 2023)                             |
| `user_data.sh`             | 初回起動時にDocker/Docker Composeをインストールするブートストラップ |
| `outputs.tf`               | 作成後に表示する情報 (パブリックIPなど)                             |
| `terraform.tfvars.example` | 変数の入力例                                                        |

variable "aws_region" {
  description = "リソースを作成するAWSリージョン"
  type        = string
  default     = "ap-northeast-1"
}

variable "project_name" {
  description = "リソース名のプレフィックス・タグ付けに使う名前"
  type        = string
  default     = "portfolio-site"
}

variable "instance_type" {
  description = "EC2インスタンスタイプ。無料枠 or 最安を想定 (t3.micro / t4g.micro など)"
  type        = string
  default     = "t3.micro"
}

variable "root_volume_size_gb" {
  description = "ルートEBSボリュームサイズ(GB)。小さいほど安い"
  type        = number
  default     = 8
}

variable "key_pair_name" {
  description = "SSH接続用に事前にAWSコンソール/CLIで作成したEC2キーペア名。Terraformではキーペア自体は作成しない"
  type        = string
}

variable "ssh_allowed_cidr" {
  description = "SSH(22番ポート)を許可する自分のグローバルIP (例: 203.0.113.4/32)。0.0.0.0/0は非推奨"
  type        = string
}

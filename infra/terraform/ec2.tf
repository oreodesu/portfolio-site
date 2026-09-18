# 最新のAmazon Linux 2023 AMI (x86_64) をAWSから動的に取得する
data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_instance" "app" {
  ami                    = data.aws_ami.al2023.id
  instance_type          = var.instance_type
  key_name               = var.key_pair_name
  subnet_id              = data.aws_subnets.default.ids[0]
  vpc_security_group_ids = [aws_security_group.app.id]

  root_block_device {
    volume_type = "gp3"
    volume_size = var.root_volume_size_gb
  }

  user_data = file("${path.module}/user_data.sh")

  tags = {
    Name    = "${var.project_name}-app"
    Project = var.project_name
  }
}

# コスト最優先のため、Elastic IPはあえて割り当てていない
# (EIPは未アタッチ状態だと課金対象になるため、インスタンス再起動のたびに
#  パブリックIPが変わる制約を許容する構成)。固定IPが必要になったら
# aws_eip リソースを追加してアタッチすること。

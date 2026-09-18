output "instance_id" {
  value = aws_instance.app.id
}

output "instance_public_ip" {
  value = aws_instance.app.public_ip
}

output "instance_public_dns" {
  value = aws_instance.app.public_dns
}

output "security_group_id" {
  value = aws_security_group.app.id
}

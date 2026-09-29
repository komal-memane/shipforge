output "vpc_id" {
  description = "ShipForge VPC ID"
  value       = aws_vpc.shipforge.id
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = aws_subnet.private[*].id
}

output "availability_zones" {
  description = "Availability zones used by ShipForge"
  value       = data.aws_availability_zones.available.names
}
output "eks_cluster_name" {
  description = "EKS cluster name"
  value       = aws_eks_cluster.shipforge.name
}

output "eks_cluster_endpoint" {
  description = "EKS cluster API endpoint"
  value       = aws_eks_cluster.shipforge.endpoint
}

output "eks_node_group_name" {
  description = "EKS managed node group name"
  value       = aws_eks_node_group.shipforge.node_group_name
}
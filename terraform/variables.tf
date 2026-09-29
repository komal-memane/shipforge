variable "aws_region" {
  description = "AWS region for ShipForge"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "shipforge"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "CIDR block for ShipForge VPC"
  type        = string
  default     = "10.0.0.0/16"
}
variable "project_id" {
  description = "Project ID"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "region" {
  description = "Resources Region"
  type        = string
  default     = "us-central1"
}

variable "firebase_location" {
  description = "Firebase Location"
  type        = string
  default     = "nam5"  # North America multi-region
} 
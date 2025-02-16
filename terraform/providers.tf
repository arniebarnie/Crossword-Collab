terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
    time = {
      source = "hashicorp/time"
      version = "~> 0.10.0"
    }
  }
}

# For quota checks
provider "google-beta" {
  user_project_override = true
  project = var.project_id
  region  = var.region
}

# For project creation and service initialization
provider "google-beta" {
  alias                = "no_user_project_override"
  user_project_override = false
  project = var.project_id
  region  = var.region
} 
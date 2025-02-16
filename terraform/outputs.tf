output "web_app_config" {
  description = "Firebase Web App configuration"
  value = {
    app_id = google_firebase_web_app.default.app_id
    project_id = google_project.crossword.project_id
  }
  sensitive = true
}

output "project_id" {
  description = "Project ID"
  value = google_project.crossword.project_id
}

output "github_actions_key" {
  description = "GitHub Actions Service Account Key"
  value = google_service_account_key.github_actions.private_key
  sensitive = true
} 
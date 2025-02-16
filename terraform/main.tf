# Create new Google Cloud project
resource "google_project" "crossword" {
  provider   = google-beta.no_user_project_override
  name       = var.project_name
  project_id = var.project_id

  # Required for Firebase
  labels = {
    "firebase" = "enabled"
  }
}

# Enable required APIs
resource "google_project_service" "services" {
  provider = google-beta.no_user_project_override
  project  = google_project.crossword.project_id
  for_each = toset([
    "serviceusage.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "firestore.googleapis.com",
    "firebaserules.googleapis.com",
    "firebasestorage.googleapis.com",
    "storage.googleapis.com",
    "identitytoolkit.googleapis.com",
    "firebase.googleapis.com"
  ])
  service = each.key
  disable_on_destroy = false
}

# Add delay after enabling APIs
resource "time_sleep" "wait_for_apis" {
  depends_on = [google_project_service.services]
  create_duration = "60s"
}

# Enable Firebase
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = google_project.crossword.project_id
  depends_on = [
    time_sleep.wait_for_apis
  ]
}

# Create Firestore database
resource "google_firestore_database" "default" {
  provider = google-beta
  project  = google_project.crossword.project_id
  name     = "(default)"
  location_id = var.firebase_location
  type     = "FIRESTORE_NATIVE"
  concurrency_mode = "OPTIMISTIC"

  depends_on = [
    time_sleep.wait_for_apis,
    google_firebase_project.default
  ]
}

# Create Firestore security rules
resource "google_firebaserules_ruleset" "firestore" {
  provider = google-beta
  project  = google_project.crossword.project_id
  source {
    files {
      name    = "firestore.rules"
      content = file("${path.module}/firebase/firestore.rules")
    }
  }

  depends_on = [
    time_sleep.wait_for_apis,
    google_firestore_database.default
  ]
}

# Apply Firestore security rules
resource "google_firebaserules_release" "firestore" {
  provider     = google-beta
  name         = "cloud.firestore"
  ruleset_name = google_firebaserules_ruleset.firestore.name
  project      = google_project.crossword.project_id
}

# Create Web App
resource "google_firebase_web_app" "default" {
  provider     = google-beta
  project      = google_project.crossword.project_id
  display_name = "Crossword Collab"
  deletion_policy = "DELETE"

  depends_on = [
    google_firebase_project.default
  ]
}

# Create service account for GitHub Actions
resource "google_service_account" "github_actions" {
  account_id   = "github-actions"
  display_name = "GitHub Actions Service Account"
  project      = google_project.crossword.project_id
}

# Grant Firebase Admin role to service account
resource "google_project_iam_member" "firebase_admin" {
  project = google_project.crossword.project_id
  role    = "roles/firebase.admin"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Create service account key
resource "google_service_account_key" "github_actions" {
  service_account_id = google_service_account.github_actions.name
} 
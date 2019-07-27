workflow "Deploy on Now" {
  on = "push"
  resolves = ["release"]
}

# Stage for testing (then filter master to deploy)
action "staging" {
  uses = "actions/zeit-now@master"
  args = "--target staging"
  secrets = ["ZEIT_TOKEN"]
}

# Filter for master branch (release or not?)
action "master-branch-filter" {
  needs = "staging"
  uses = "actions/bin/filter@master"
  args = "branch master"
}

# Try a new release
action "release" {
  needs = "master-branch-filter"
  uses = "actions/zeit-now@master"
  secrets = ["ZEIT_TOKEN"]
  args = "--target production"
}

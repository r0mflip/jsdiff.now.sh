workflow "Deploy on Now" {
  on = "push"
  resolves = ["release"]
}

# Deploy, and write deployment to file (every change deploy)
action "deploy" {
  uses = "actions/zeit-now@master"
  args = "--public --no-clipboard deploy ./site > $HOME/$GITHUB_ACTION.txt"
  secrets = ["ZEIT_TOKEN"]
}

# Always create an alias using the SHA (then filter master to deploy)
action "alias" {
  needs = "deploy"
  uses = "actions/zeit-now@master"
  args = "alias `cat /github/home/deploy.txt` $GITHUB_SHA"
  secrets = ["ZEIT_TOKEN"]
}

# Filter for master branch (alias to new deployment or not?)
action "master-branch-filter" {
  needs = "alias"
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

workflow "Deploy to netlify" {
  on = "push"
  resolves = ["Publish"]
}

# filter for master branch
action "filter-master" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

# start publish
action "Publish" {
  needs = "filter-master"
  uses = "netlify/actions/cli@master"
  args = "deploy --dir=site"
  secrets = ["NETLIFY_AUTH_TOKEN", "NETLIFY_SITE_ID"]
}

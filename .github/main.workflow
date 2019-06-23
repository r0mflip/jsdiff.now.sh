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
  uses = "netlify/actions/build@master"
  secrets = ["GITHUB_TOKEN", "NETLIFY_SITE_ID"]
  env = {
    NETLIFY_CMD = "npm run build"
    NETLIFY_DIR = "site/"
  }
}

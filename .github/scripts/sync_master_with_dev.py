import os
import sys

from github import Github

PULL_REQUEST_TITLE = '[Automated] Merge master branch with the dev branch'

ballerina_bot_token = os.environ['BALLERINA_BOT_TOKEN']
github = Github(ballerina_bot_token)

def main():
    repo = github.get_repo('ballerina-platform/ballerina-dev-website')

    # Check whether dev branch already has an unmerged PR from master branch, delete if exists
    pulls = repo.get_pulls(state='open', base='dev')
    for pull in pulls:
        if (pull.head.ref == 'master'):
            print ("Dev branch already has an open pull request from master branch")
            pull.edit(state = 'closed')
            break

    create_pull_request(repo, 'master')

def create_pull_request(repo, source_branch):
    try:
        pull_request_title = PULL_REQUEST_TITLE
        created_pr = repo.create_pull(
            title=pull_request_title,
            body='Daily syncing of master branch content with the dev branch',
            head=source_branch,
            base=repo.default_branch
        )
        log_message = "[Info] Automated PR created for ballerina-dev-website repo at " + created_pr.html_url
        print(log_message)
    except Exception as e:
        print("[Error] Error occurred while creating pull request ", e)
        sys.exit(1)

main()
  
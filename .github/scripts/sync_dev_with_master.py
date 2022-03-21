import os
import sys
import time
from github import Github


PULL_REQUEST_TITLE = '[Automated] Merge master branch with the dev'

ballerina_bot_token = os.environ['BALLERINA_BOT_TOKEN']
ballerina_reviewer_bot_token = os.environ['BALLERINA_REVIEWER_BOT_TOKEN']
github = Github(ballerina_bot_token)


def main():
    repo = github.get_repo('https://github.com/ballerina-platform/ballerina-dev-website')
    branches = repo.get_branches()
    temp_branch = 'sync-master'

    for branch in branches:
        if (branch.name == 'master'):
            master_branch = branch
            break

    # Check whether master branch already has an unmerged PR from temporary branch, delete if exists
    pulls = repo.get_pulls(state='open')
    for pull in pulls:
        if (pull.head.ref == temp_branch):
            print ("Dev branch already has an open pull request from " + temp_branch)
            pull.edit(state = 'closed')
            break

    # if temporary branch exists, delete it
    for branch in branches:
        if branch.name == temp_branch:
            ref = repo.get_git_ref('heads/' + temp_branch)
            ref.delete()
            break

    # create the temporary branch from master branch
    repo.create_git_ref(ref='refs/heads/' + temp_branch, sha=master_branch.commit.sha)
    ref = repo.get_git_ref('heads/' + temp_branch)

    pr = create_pull_request(repo, temp_branch)


def create_pull_request(repo, temp_branch):
    try:
        pull_request_title = PULL_REQUEST_TITLE
        created_pr = repo.create_pull(
            title=pull_request_title,
            body='Daily syncing of master branch content with the dev',
            head=temp_branch,
            base='dev'
        )
        log_message = "[Info] Automated PR created for ballerina-lang repo at " + created_pr.html_url
        print(log_message)
    except Exception as e:
        print("[Error] Error occurred while creating pull request ", e)
        sys.exit(1)

    try:
        approve_pr(created_pr.number)
    except Exception as e:
        print("[Error] Error occurred while approving the PR ", e)
    return created_pr


def approve_pr(pr_number):
    time.sleep(5)
    r_github = Github(ballerina_reviewer_bot_token)
    repo = r_github.get_repo('https://github.com/ballerina-platform/ballerina-dev-website')
    pr = repo.get_pull(pr_number)
    try:
        pr.create_review(event='APPROVE')
        print(
            "[Info] Automated master update PR approved. PR: " + pr.html_url)
    except Exception as e:
        raise e


main()

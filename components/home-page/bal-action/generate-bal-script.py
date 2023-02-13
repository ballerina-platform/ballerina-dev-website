import sys

mdFileName = sys.argv[1]
balScriptName = mdFileName.strip().split(".")[0] + ".bal"

mdFilePath = 'components/home-page/bal-action/action-bbe/' + mdFileName

with open(mdFilePath, 'r') as md:
    md_content = md.readlines()

action_bbe = open(balScriptName , 'a')
for line in md_content:
    if "```" not in line:
        action_bbe.write(line)
action_bbe.close()

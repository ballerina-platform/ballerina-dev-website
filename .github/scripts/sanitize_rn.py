import json
import sys

metadata_json_path = sys.argv[1]
with open(metadata_json_path) as f:
    json_data =json.load(f)

version = json_data['version'] 

with open('RN.md', 'r') as myfile:
  data = myfile.read().replace('\n', '\\n')
  data = data.replace('\"', '\\"')

output='{{\"tag_name\": \"v{}\", \"target_commitish\": \"master\", \"name\": \"Ballerina {} Released!\", \"body\": \"{}\", \"draft\": false, \"prerelease\": false}}'.format(version, version, data)

f = open("out.json", "a")
f.write(output)
f.close()

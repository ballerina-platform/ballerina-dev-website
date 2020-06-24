import json
import os
from shutil import copyfile
import sys

if (len(sys.argv)!=3):
    print ('Please provide two args <url of archived_releases.json> and <url of latest_releases.json>')
    sys.exit()
  
# path of archived_releases.json
path_archived = sys.argv[1]

# path of latest_release.json
path_latest = sys.argv[2]

# getting the archived_realease.json
with open(path_archived, 'r') as content_file:
    temp = content_file.read()
    data = json.loads(temp)

# getting the latest_realease.json
with open(path_latest, 'r') as content_file:
    temp = content_file.read() 
    latest_realease = json.loads(temp)

for release in data:
    if release['version'] == latest_realease['version']:
        sys.exit("This version already exist in release_notes_versions.json")

# append both json
data.append(latest_realease)

# write to release_notes_versions.json
baseDir = os.path.dirname(os.path.realpath(__file__))
outputFile_rel = baseDir + "/target/release_notes_versions.json"
os.makedirs(os.path.dirname(outputFile_rel), exist_ok=True)
with open(outputFile_rel, "w") as f:
    json.dump(data, f, indent=3)

print ("Check .../target/output/")

import json
import os

with open('_data/latest/metadata.json') as f:
    data =json.load(f)

version = data['version'] 
url = 'https://dist.ballerina.io/downloads/'+version+'/ballerina-'+version+'.vsix'

os.system("wget -O ballerina.vsix "+url)

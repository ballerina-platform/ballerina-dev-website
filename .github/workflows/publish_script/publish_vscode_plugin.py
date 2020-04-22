import json
import os

with open('latest_release.json') as f:
    data =json.load(f)

version = data['version'] 
url = 'https://product-dist.ballerina.io/downloads/'+version+'/ballerina-'+version+'.vsix'

os.system("wget -O ballerina.vsix "+url)

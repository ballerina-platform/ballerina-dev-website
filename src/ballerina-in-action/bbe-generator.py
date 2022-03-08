from bs4 import BeautifulSoup

with open('index.html','r') as soup1:
    html_doc=soup1.read()
soup = BeautifulSoup(html_doc, 'html.parser')
bbes = soup.find_all('code')
count = 0

for bbe in bbes:
    fileName = "action_bbe" + str(count) + ".bal"
    action_bbe = open(fileName , 'w')
    action_bbe.write(bbe.get_text().strip())
    action_bbe.close()
    count+=1
    
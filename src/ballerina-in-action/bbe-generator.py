from bs4 import BeautifulSoup

with open('index.html','r') as soup1:
    html_doc=soup1.read()
soup = BeautifulSoup(html_doc, 'html.parser')
# bbe = soup.find_all('div',id='firstTab')

# with open('bbe1.bal','r') as fix:
#     fix_1 = fix.read()
# print(soup.find('div',id='secondTab').get_text().strip())
bbes = soup.find_all('code')
count = 0
for bbe in bbes:
    fileName = "action_bbe" + str(count) + ".bal"
    action_bbe = open(fileName , 'w')
    action_bbe.write(bbe.get_text().strip())
    action_bbe.close()
    count+=1
    print(bbe.get_text())
# w = open('changed_1.html','w')
# w.write(soup.prettify())
# w.close()


from requests import post
from json import dump
from time import sleep
from netflix import url, headers
from time import sleep
from threading import Thread

genres = {}


def rangeCollect(index):
    ids = [i for i in range(index, index + 8000)]
    data = {
        "path": """["genres", """ + str(ids) + """, "name"]"""}
    try:
        response = post(url, json=data, headers=headers).json()
    except:
        print('Error from ' + str(index))
    print('Collected range ' + str(index))
    objects = response['jsonGraph']['genres']
    for genreId in objects:
        genre = objects[genreId]
        if 'value' in genre['name'] and genre['name']['value'] is not None:
            genres[genreId] = genre['name']['value']


threads = []
for ids in range(12500):
    threads.append(Thread(target=rangeCollect, args=(ids * 8000,)))
for i, t in enumerate(threads):
    t.start()
    sleep(0.5)
for t in threads:
    t.join()
dump(genres, open('data/genres.json', 'w', encoding='utf-8'),
     ensure_ascii=False, sort_keys=True, indent=2)

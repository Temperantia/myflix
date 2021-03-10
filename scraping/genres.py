
from requests import post
from json import dump
from time import sleep
from netflix import url, headers
from threads import threads

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


args = [[ids * 8000] for ids in range(12500)]
threads(rangeCollect, args, 0.5, 'Collecting genres')
dump(genres, open('data/genres.json', 'w', encoding='utf-8'),
     ensure_ascii=False, sort_keys=True, indent=2)

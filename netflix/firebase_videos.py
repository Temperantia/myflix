from json import load, dumps, dump
from random import uniform
from time import sleep
from firebase import video_collection, data_collection
from slugify import slugify
from threads import threads
from random import randint
from datetime import datetime

"""
a : availability
b : story art
c : category
d : description / synopsis
e : episode number
g : genres
i : image / tall box art
m : current month
n : current new release (< 2 weeks)
o : original
p : popularity
q : rank
r : route
s : season count
t : title
u : type 1 = show 0 = movie
v : video maturity
w : current week
y : release year
z : score

"""

searches = []
types = {}
title_ids = {}
CUT = 1200
now = datetime.now()
data = {k: v for k, v in sorted(
    load(open('data/videos.json', 'r', encoding='utf-8')).items(), key=lambda item: (not item[1]['title'][0].isalpha(), item[1]['title']) if item[1]['title'] else (False, item[1]['title']))}
dict_genres = load(open('data/genres_tagged.json', 'r', encoding='utf-8'))


def extract_categories():
  categories = []
  for category in dict_genres:
    categories.append(category)
  dump(categories, open('data/categories.json', 'w', encoding='utf-8'),
       ensure_ascii=False, indent=2, sort_keys=True)


def create_route(title, type, id):
  return ('/tvshows/' if type == 'show' else '/films/') + slugify(title + ('-' + str(id) if id > 0 else ''))


def find_key_by_route(route):
  global searches
  for index, search in enumerate(searches):
    for key in list(search):
      if search[key]['r'] == route:
        return index, key
  return None, None


def find_categories(genres):
  found = []
  for genre in genres:
    for category in dict_genres:
      for dict_genre in dict_genres[category]:
        if not genre['name'] in found and genre['name'] == dict_genres[category][dict_genre]:
          found.append(category)
          break
  return found


def remove_ids(genres):
  names = []
  for genre in genres:
    names.append(genre['name'])
  return names


def duplicate(route, type, title):
  global searches
  if route in types and types[route] == type:
    index, key = find_key_by_route(route)
    if key:
      if not id in title_ids:
        title_ids[id] = 1
      else:
        title_ids[id] += 1
      searches[index][key]['r'] = create_route(
          title, type, title_ids[id])
      route = create_route(title, type, title_ids[id] + 1)
  return route


def search_videos(video, id, index):
  global searches
  index_search = int(index / CUT)
  if len(searches) == index_search:
    searches.append({})
    print(index_search)
  type = video['summary']['type']
  route = create_route(video['title'], type, 0)
  route = duplicate(route, type, video['title'])
  searches[index_search][id] = {'r': route, 't': video['title'], 'i': video['tallBoxArt'] if 'tallBoxArt' in video else video['boxArt'], 'b': video['storyArt'], 'c': find_categories(
      video['genres']), 'g': remove_ids(video['genres']), 'y': video['releaseYear'], 'v': video['maturity'], 'd': video['synopsis'], 'a': video['availability']['availabilityStartTime'], 'u': 1 if video['summary']['type'] == 'show' else 0, 'z': video['score']}

  if video['summary']['isOriginal']:
    searches[index_search][id]['o'] = 1
  if video['seasonCount']:
    searches[index_search][id]['s'] = video['seasonCount']
  if video['episodeCount']:
    searches[index_search][id]['e'] = video['episodeCount']
  types[route] = type


def upload(id, index, data):
  video = data[id]
  if not 'exists' in video:
    random = round(uniform(7.5, 9.8), 1)
    video['scores'] = {'1': random}
    video['score'] = random
    video['rank'] = None
    video['popularity'] = None
    video['followers'] = {str(i): now for i in range(randint(0, 5))}
    video['exists'] = True

  search_videos(video, id, index)
  #ref.set(video, merge=True)


def upload_search():
  global searches
  for doc in data_collection.stream():
    doc.reference.delete()
  for index, search in enumerate(searches):
    arr = []
    for key in search:
      arr.append({'id': key} | search[key])
    json = dumps(arr)
    print(len(json.encode('utf-8')))  # must not exceed 1048487
    data_collection.document('search' + str(index)).set({'search': json})


def launch():
  ids = []
  for index, id in enumerate(data):
    ids.append([
        id,
        index,
        data
    ])
  threads(upload, ids, 0)
  dump(data, open('data/videos.json',
                  'w', encoding='utf-8'), ensure_ascii=False, indent=2)
  upload_search()



launch()

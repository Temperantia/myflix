from json import load,  dump
from slugify import slugify
from datetime import datetime
from pathlib import Path
from os import path
from random import uniform, randint
import meilisearch

from firebase import video_collection, globals_collection
from threads import threads

"""
a : availability
b : story art
c : category
d : description / synopsis
e : episode number
f : follower number
g : genres
h : bingeworthy
i : image / tall box art
j : trending
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

searches = {}
types = {}
title_ids = {}
file = load(open(path.join(
    Path(__file__).parent.absolute(), 'data/videos.json'), 'r', encoding='utf-8'))
items = {}
for id, video in file.items():
  if 'title' in video and video['title']:
    items[id] = video
data = {k: v for k, v in sorted(items.items(), key=lambda item: (not item[1]['title'][0].isalpha(
), item[1]['title']))}
dict_genres = load(open(path.join(
    Path(__file__).parent.absolute(), 'data/genres_tagged.json'), 'r', encoding='utf-8'))
client = meilisearch.Client('https://search.my-flix.net')


def create_route(title, type, id):
  return ('/tvshows/' if type == 'show' else '/films/') + slugify(title + ('-' + str(id) if id > 0 else '')) + '/overview'


def find_key_by_route(route):
  global searches
  for key in list(searches):
    if searches[key]['r'] == route:
      return key
  return None


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
    key = find_key_by_route(route)
    if key:
      if not id in title_ids:
        title_ids[id] = 1
      else:
        title_ids[id] += 1
      searches[key]['r'] = create_route(
          title, type, title_ids[id])
      route = create_route(title, type, title_ids[id] + 1)
  return route


def search_videos(video, id):
  global searches
  searches[id] = {'r': video['route'], 't': video['title'], 'i': video['Poster'] if 'Poster' in video else video['boxArt'], 'b': video['storyArt'], 'c': find_categories(
      video['genres']), 'g': remove_ids(video['genres']), 'y': video['releaseYear'], 'v': video['maturity'], 'd': video['synopsis'], 'a': video['availability']['availabilityStartTime'], 'u': 1 if video['summary']['type'] == 'show' else 0, 'z': video['score'], 'imdbLongName': video['LongIMDbTitle'] if 'LongIMDbTitle' in video else ''}

  if video['summary']['isOriginal']:
    searches[id]['o'] = 1
  if video['seasonCount']:
    searches[id]['s'] = video['seasonCount']
  if video['episodeCount']:
    searches[id]['e'] = video['episodeCount']


def upload(id,  data):
  video = data[id]

  type = video['summary']['type']
  video['route'] = create_route(video['title'], type, 0)
  video['route'] = duplicate(video['route'], type, video['title'])
  types[video['route']] = type
  rating = round(video['Rating'] - uniform(0.1, 0.4),
                 1) if 'Rating' in video and video['Rating'] else None

  # if not 'exists' in video:
  video['scores'] = {str(index): rating for index in range(
      randint(200, 700))} if rating else {}
  video['score'] = rating
  video['favorites'] = []
  video['exists'] = True

  search_videos(video, id)
  video_collection.document(id).set(video, merge=True)


def upload_search():
  global searches
  arr = []
  for key in searches:
    arr.append({**{'id': key}, **searches[key]})
  client.index('videos').update_documents(arr)
  show_count = sum(1 for title in arr if title['u'] == 1)
  film_count = sum(1 for title in arr if title['u'] == 0)
  globals_collection.document('globals').update(
      {'showCount': show_count, 'filmCount': film_count})


def launch():
  ids = []
  for id in data:
    ids.append([
        id,
        data
    ])
  threads(upload, ids, 0, 'Uploading titles')
  dump(data, open(path.join(
      Path(__file__).parent.absolute(), 'data/videos.json'),
      'w', encoding='utf-8'), ensure_ascii=False, indent=2)
  upload_search()


launch()

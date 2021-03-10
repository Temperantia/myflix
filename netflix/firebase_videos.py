from json import load,  dump
from slugify import slugify
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
show_count = 0
film_count = 0


def create_route(title, type, id):
  global types, title_ids

  route = ('/tvshows/' if type == 'show' else '/films/') + \
      slugify(title + ('-' + str(id) if id > 0 else '')) + '/overview'
  if route in types and types[route] == type:
    if not id in title_ids:
      title_ids[id] = 1
    else:
      title_ids[id] += 1
    route = create_route(title, type, title_ids[id])
  types[route] = type
  return route


def find_genre(genre, category, found):
  for dict_genre in dict_genres[category]:
    if genre == dict_genres[category][dict_genre]:
      found.append(category)
      return found
  return found


def find_categories(genres):
  found = []
  for genre in genres:
    for category in dict_genres:
      if category in found:
        continue
      found = find_genre(genre, category, found)
  return found


def search_videos(video, id):
  search = {'r': video['route'], 't': video['title'], 'i': video['Poster'] if 'Poster' in video else video['boxArt'], 'b': video['storyArt'], 'c': video['categories'], 'g': video['genres'], 'y': video['releaseYear'], 'v': video['maturity'],
            'd': video['synopsis'], 'a': video['availability']['availabilityStartTime'], 'u': 1 if video['summary']['type'] == 'show' else 0, 'z': video['score'], 'imdbLongName': video['LongIMDbTitle'] if 'LongIMDbTitle' in video else ''}

  if video['summary']['isOriginal']:
    search['o'] = 1
  if video['seasonCount']:
    search['s'] = video['seasonCount']
  if video['episodeCount']:
    search['e'] = video['episodeCount']
  client.index('videos').update_documents([{**{'id': id}, **search}])


def upload(id,  data):
  global show_count, film_count
  video = data[id]

  if video['summary']['type'] == 'show':
    show_count += 1
  else:
    film_count += 1

  video['route'] = create_route(video['title'], video['summary']['type'], 0)
  rating = round(video['Rating'] - uniform(0.1, 0.4),
                 1) if 'Rating' in video and video['Rating'] else None
  video['categories'] = find_categories(video['genres'])

  # if not 'exists' in video:
  video['scores'] = {str(index): rating for index in range(
      randint(200, 700))} if rating else {}
  video['score'] = rating
  video['favorites'] = []
  video['exists'] = True

  video_collection.document(id).set(video, merge=True)
  search_videos(video, id)


def launch():
  args = [[id, data] for id in data]
  #args = [args[0]]
  threads(upload, args, 0, 'Uploading titles')

  dump(data, open(path.join(
      Path(__file__).parent.absolute(), 'data/videos.json'),
      'w', encoding='utf-8'), ensure_ascii=False, indent=2)
  globals_collection.document('globals').update(
      {'showCount': show_count, 'filmCount': film_count})


launch()

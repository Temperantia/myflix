from json import load
from statistics import mean
from datetime import datetime, timedelta
from calendar import monthrange
from pathlib import Path
from os import path
import meilisearch

from threads import threads
from firebase import get_collection, video_collection

scores = {}
followers = {}
videos = {}
rank = {}
popularity = {}
bingeworthiness = {}
categories = {}

client = meilisearch.Client('http://127.0.0.1:7700')
dict_genres = load(open(path.join(
    Path(__file__).parent.absolute(), 'data/genres_tagged.json'), 'r', encoding='utf-8'))

dt = datetime.now()
start = (dt - timedelta(days=dt.weekday())).replace(hour=0,
                                                    minute=0, second=0, microsecond=0)
end = (start + timedelta(days=7)).timestamp()
start_release = (start - timedelta(days=7)).timestamp()
start = start.timestamp()

_, month_day_end = monthrange(dt.year, dt.month)
month_start = (dt.replace(day=1, minute=0,
                          second=0, microsecond=0)).timestamp()
month_end = (dt.replace(day=month_day_end, minute=0,
                        second=0, microsecond=0)).timestamp()

trending = {
    "The Queen's Gambit": 3
}


"""
Each week :
1. Netflix (40m)
2. Media center : Description, Original box art (10m)
3. Statistics : Rank, Popularity, Periodic (10m)
4. IMDB : Cast, Tall box art (2h)

"""


def upload_ranks(id):
  print(rank[id])
  video_collection.document(id).set(
      {'score': scores[id], 'rank': rank[id], 'popularity': popularity[id]}, merge=True)


def find_categories(genres):
  found = []
  for genre in genres:
    for category in dict_genres:
      for dict_genre in dict_genres[category]:
        if not genre['name'] in found and genre['name'] == dict_genres[category][dict_genre]:
          found.append(category)
          break
  return found


def get_video_stats():
  global categories
  print('Getting collection')
  collection = get_collection(video_collection, [])
  print('Starting calculation')
  for video in collection:
    id = video.id
    video = video.to_dict()
    videos[id] = video
    followers[id] = len(video['followers']) if video['followers'] else 0
    try:
      video['score'] = mean(list(video['scores'].values())
                            ) if video['scores'] else None
    except:
      print(video)
    scores[id] = video['score'] if video['score'] else 0
    bingeworthiness[id] = len(video['bingeworthiness']) / \
        2 if 'bingeworthiness' in video and video['bingeworthiness'] else 0
    for category in find_categories(video['genres']):
      if category in categories:
        categories[category]['value'] += 1
      else:
        categories[category] = {'category': category,
                                'value': 1, 'image': video['boxArt']}

  ordered = sorted(scores.items(), key=lambda elem: elem[1], reverse=True)
  for index, id in enumerate(ordered):
    rank[id[0]] = index + 1

  ordered = sorted(followers.items(), key=lambda elem: elem[1], reverse=True)
  for index, id in enumerate(ordered):
    popularity[id[0]] = index + 1

  categories = sorted(categories.items(),
                      key=lambda elem: elem[1]['value'], reverse=True)[:3]
  client.index('categories').add_documents(categories)

  ids = [[id] for id in videos]
  threads(upload_ranks, ids, 0, 'Uploading ranks')


def update_search_tables():
  print('Updating search tables')
  search = client.index('videos').get_documents()

  for video in search:
    video['f'] = followers[video['id']]
    video['z'] = scores[video['id']]
    video['q'] = rank[video['id']]
    video['p'] = popularity[video['id']]
    video['h'] = bingeworthiness[video['id']]

    availability = video['a'] / 1000 if video['a'] else None
    video['w'] = 1 if availability and availability >= start and availability <= end else 0
    video['n'] = 1 if availability and availability >= start_release and availability <= end else 0
    video['m'] = 1 if availability and availability >= month_start and availability <= month_end else 0
    video['j'] = trending[video['t']] if video['t'] in trending else None

  print('Uploading search tables')
  client.index('videos').add_documents(search)


get_video_stats()
update_search_tables()

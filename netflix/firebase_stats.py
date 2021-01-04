from firebase import get_collection, video_collection, data_collection
from json import load, dumps, loads
from threads import threads
from random import uniform
from statistics import mean
from datetime import datetime, timedelta
from calendar import monthrange

scores = {}
followers = {}
videos = {}
rank = {}
popularity = {}

dt = datetime.now()
start = (dt - timedelta(days=dt.weekday())).replace(hour=0,
                                                    minute=0, second=0, microsecond=0)
end = (start + timedelta(days=7)).timestamp()
start_release = (start - timedelta(days=7)).timestamp()
start = start.timestamp()

month_day_start, month_day_end = monthrange(dt.year, dt.month)
month_start = (dt.replace(day=month_day_start, minute=0,
                          second=0, microsecond=0)).timestamp()
month_end = (dt.replace(day=month_day_end, minute=0,
                        second=0, microsecond=0)).timestamp()


"""
Each week :
1. Netflix (40m)
2. Media center : Description, Original box art (10m)
3. Statistics : Rank, Popularity, Periodic (10m)
4. IMDB : Cast, Tall box art (7h) (Azure)

"""


def upload_ranks(id):
  video_collection.document(id).set(
      {'score': scores[id], 'rank': rank[id], 'popularity': popularity[id]}, merge=True)


def get_video_stats():
  collection = get_collection(video_collection, [])
  print('Starting calculation')
  for video in collection:
    id = video.id
    video = video.to_dict()
    videos[id] = video
    followers[id] = len(video['followers'])
    video['score'] = mean(list(video['scores'].values()))
    scores[id] = video['score']

  ordered = sorted(scores.items(), key=lambda elem: elem[1], reverse=True)
  for index, id in enumerate(ordered):
    rank[id[0]] = index + 1

  ordered = sorted(followers.items(), key=lambda elem: elem[1], reverse=True)
  for index, id in enumerate(ordered):
    popularity[id[0]] = index + 1

  print('Uploading ranks')
  ids = [[id] for id in videos]
  #threads(upload_ranks, ids, 0)


def update_search_tables():
  print('Updating search tables')
  search = []
  for doc in data_collection.stream():
    search += loads(doc.to_dict()['search'])
    #doc.reference.delete()

  for video in search:
    video['z'] = scores[video['id']]
    video['q'] = rank[video['id']]
    video['p'] = popularity[video['id']]
    if video['a']:
      availability = video['a'] / 1000
      video['w'] = 1 if availability >= start and availability <= end else 0
      video['n'] = 1 if availability >= start_release and availability <= end else 0
      video['m'] = 1 if availability >= month_start and availability <= month_end else 0

  print('Uploading search tables')
  searches = [search[x:x+1000] for x in range(0, len(search), 1000)]
  for index, s in enumerate(searches):
    json = dumps(s)
    print(len(json.encode('utf-8')))  # must not exceed 1048487
    data_collection.document('search' + str(index)).set({'search': json})


get_video_stats()
update_search_tables()

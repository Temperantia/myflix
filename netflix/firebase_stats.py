from firebase import get_collection, video_collection, data_collection
from json import dumps, loads
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
bingeworthiness = {}

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
4. IMDB : Cast, Tall box art (7h) (Azure)

"""


def upload_ranks(id):
  print(rank[id])
  video_collection.document(id).set(
      {'score': scores[id], 'rank': rank[id], 'popularity': popularity[id]}, merge=True)


def get_video_stats():
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

  ordered = sorted(scores.items(), key=lambda elem: elem[1], reverse=True)
  for index, id in enumerate(ordered):
    rank[id[0]] = index + 1

  ordered = sorted(followers.items(), key=lambda elem: elem[1], reverse=True)
  for index, id in enumerate(ordered):
    popularity[id[0]] = index + 1

  print('Uploading ranks')
  ids = [[id] for id in videos]
  threads(upload_ranks, ids, 0)


def update_search_tables():
  print('Updating search tables')
  CUT = 900
  search = []
  for doc in data_collection.stream():
    search += loads(doc.to_dict()['search'])
    # doc.reference.delete()

  for video in search:
    video['f'] = followers[video['id']]
    video['z'] = scores[video['id']]
    video['q'] = rank[video['id']]
    video['p'] = popularity[video['id']]
    video['h'] = bingeworthiness[video['id']]
    if video['a']:
      availability = video['a'] / 1000
      if availability >= start and availability <= end:
        video['w'] = 1
      if availability >= start_release and availability <= end:
        video['n'] = 1
      if availability >= month_start and availability <= month_end:
        video['m'] = 1
    if video['t'] in trending:
      video['j'] = trending[video['t']]

  print('Uploading search tables')
  searches = [search[x:x+CUT] for x in range(0, len(search), CUT)]
  for index, s in enumerate(searches):
    json = dumps(s)
    print(len(json.encode('utf-8')))  # must not exceed 1048487
    data_collection.document('search' + str(index)).set({'search': json})


get_video_stats()
update_search_tables()

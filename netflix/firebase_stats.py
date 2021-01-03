from firebase import get_collection, video_collection
from json import load, dumps
from random import uniform
from statistics import mean
from datetime import datetime, timedelta
from calendar import monthrange

scores = {}
followers = {}
videos = {}
rank = {}
popularity = {}


for video in get_collection(video_collection, []):
  video = video.get()
  id = video.id
  video = video.to_dict()
  videos[id] = video
  followers[id] = len(video['followers'])
  video['score'] = mean(list(video['scores'].values()))
  scores[id] = video['score']

print('rank')
ordered = sorted(scores.items(), key=lambda elem: elem[1], reverse=True)
for index, id in enumerate(ordered):
  rank[id[0]] = index + 1

print('popularity')
ordered = sorted(followers.items(), key=lambda elem: elem[1], reverse=True)
for index, id in enumerate(ordered):
  popularity[id[0]] = index + 1

dt = datetime.now()
start = (dt - timedelta(days=dt.weekday())).replace(hour=0,
                                                    minute=0, second=0, microsecond=0)
end = (start + timedelta(days=7)).replace(hour=0,
                                          minute=0, second=0, microsecond=0).timestamp()
start = start.timestamp()

month_day_start, month_day_end = monthrange(dt.year, dt.month)
month_start = (dt.replace(day=month_day_start, minute=0,
                          second=0, microsecond=0)).timestamp()
month_end = (dt.replace(day=month_day_end, minute=0,
                        second=0, microsecond=0)).timestamp()

for id in videos:
  video = videos[id]
  if video['availability']['availabilityStartTime']:
    availability = video['availability']['availabilityStartTime'] / 1000
    if availability >= start and availability <= end:
      video['week'] = True
    else:
      video['week'] = False
    if availability >= month_start and availability <= month_end:
      video['month'] = True
    else:
      video['month'] = False
  video['rank'] = rank[id]
  video['popularity'] = popularity[id]
  video_collection.document(id).set(video, merge=True)

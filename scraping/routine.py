from typing import Any, Dict
from random import randint, uniform
from datetime import datetime

import query_netflix
import media
import imdbpy
import scrape_imdb
import routine_stats

from utils import firebase, threads, file

QUERY_NETFLIX = True  # 40 minutes
QUERY_NETFLIX_MEDIA_CENTER = False  # 10 minutes # TODO BUG
QUERY_IMDB = True
QUERY_YOUTUBE = True
SCRAPE_IMDB = True  # ?
CALCULATE_STATS = True
UPDATE_FIRESTORE = True
UPDATE_MEILISEARCH = True

dt = datetime.now()


def get_video(video_id: str, video: Dict[str, Any]):
  if QUERY_NETFLIX_MEDIA_CENTER:
    media.request_media(video_id, video)
  if QUERY_IMDB:
    imdbpy.get_imdb_data(video)
  if QUERY_YOUTUBE:
    pass
  if SCRAPE_IMDB and 'IMDbID' in video:
    scrape_imdb.main_page(video)
  if UPDATE_FIRESTORE:
    # if not 'exists' in video:
    rating: float = round(video['Rating'] - uniform(0.1, 0.4),
                          1) if 'Rating' in video and video['Rating'] else None
    follower_number = int(video['IMDbFollowers'] * 1000 /
                          2358519) if 'IMDbFollowers' in video and video['IMDbFollowers'] else 0
    if False:
      video.update({
          'scores':  {str(index): rating for index in range(
              randint(200, 700))} if rating else {},
          'score': rating,
          'followers':  {str(index): dt for index in range(follower_number)},
          'favorites': [],
          'exists': True
      })
  if CALCULATE_STATS:
    routine_stats.get_video_stat(video_id, video)
  if UPDATE_FIRESTORE:
    firebase.video_collection.document(video_id).set(video, merge=True)


# firebase.get_collection(firebase.video_collection)
videos: Dict[str, Any] = {}

if QUERY_NETFLIX:
  query_netflix.get_videos(videos)
  a = {}
  for id in videos:
    video = videos[id]
    if 'title' in video:
      a[id] = video
  videos = a

args = [[video_id, video] for video_id, video in videos.items()]
threads.threads(get_video, args, 0.3, 'Getting videos')

file.write_json('data/videos.json', videos)

if CALCULATE_STATS:
  routine_stats.get_video_stats(videos)

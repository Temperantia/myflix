from typing import Any, Dict
from random import randint, uniform

import query_netflix
import media
import imdbpy
import scrape_imdb
import routine_stats

from utils import firebase, threads

QUERY_NETFLIX = True  # 40 minutes
QUERY_NETFLIX_MEDIA_CENTER = False  # 10 minutes # TODO BUG
QUERY_IMDB = True
QUERY_YOUTUBE = True
SCRAPE_IMDB = True  # ?
CALCULATE_STATS = True
UPDATE_FIRESTORE = True
UPDATE_MEILISEARCH = True


def get_video(video_id: str, video: Dict[str, Any]):
  if QUERY_NETFLIX_MEDIA_CENTER:
    media.request_media(video_id, video)
  if QUERY_IMDB:
    imdbpy.get_imdb_data(video)
  if QUERY_YOUTUBE:
    pass
  if SCRAPE_IMDB and 'IMDbID' in video:
    scrape_imdb.main_page(video)
  if CALCULATE_STATS:
    routine_stats.get_video_stat(video_id, video)
  if UPDATE_FIRESTORE:
    # if not 'exists' in video:
    rating: float = round(video['Rating'] - uniform(0.1, 0.4),
                          1) if 'Rating' in video and video['Rating'] else None
    video.update({
        'scores':  {str(index): rating for index in range(
            randint(200, 700))} if rating else {},
        'score': rating,
        'favorites': [],
        'exists': True
    })
    firebase.video_collection.document(video_id).set(video, merge=True)


videos: Dict[str, Any] = firebase.get_collection(firebase.video_collection)

if QUERY_NETFLIX:
  query_netflix.get_videos(videos)

threads.threads(get_video, [[video_id, video]
                            for video_id, video in videos.items()], 0.3, 'Getting videos')
if CALCULATE_STATS:
  routine_stats.get_video_stats(videos)
#print(videos)

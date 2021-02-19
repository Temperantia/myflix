
from requests import post
from json import dump, dumps, load
from time import sleep
from threads import threads
from netflix import url, headers
from video_ids import get_ids
from pathlib import Path
from os import path


def fetch_video(id, shows_with_summary):
  data = {
      "path": """["videos", """ + id + """, "summary"]"""}
  try:
    response = post(url, json=data, headers=headers).json()
    objects = response['jsonGraph']['videos']
    for videoId in objects:
      video = objects[videoId]
      summary = video['summary']['value'] if 'summary' in video and 'value' in video['summary'] else None
      if not summary or 'type' not in summary or ('$type' in summary and summary['$type'] == 'error') or summary['type'] == 'episode' or summary['type'] == 'supplemental':
        pass
      else:
        shows_with_summary[videoId] = {
            'summary': summary,
        }
  except:
    print('error ' + str(id))


def get_summary():
  shows_with_summary = load(
      open(path.join(
          Path(__file__).parent.absolute(), 'data/video_summary.json'), 'r', encoding='utf-8'))
  ids = []
  for id in get_ids():
    ids.append((id, shows_with_summary))
  threads(fetch_video, ids, 0.02)
  print('Collected ' + str(len(shows_with_summary)) + ' shows and movies')
  dump(shows_with_summary, open(path.join(
      Path(__file__).parent.absolute(), 'data/video_summary.json'),
      'w', encoding='utf-8'), ensure_ascii=False, indent=2)
  return shows_with_summary

from requests import post
from json import dump, dumps, load
from pathlib import Path
from os import path
from jsonmerge import merge

from threads import threads
from netflix import url, headers

error = 0


def rangeCollect(index, rng, videos):
  global error
  #print('Collecting ' + str(index) + ' to ' + str(index + rng))
  ids = [str(i) for i in range(index, index + rng)]
  data = {
      "path": """["videos", """ + dumps(ids) + """, "title"]"""}
  try:
    response = post(url, json=data, headers=headers)
    response = response.json()
    objects = response['jsonGraph']['videos']
    for videoId in objects:
      video = objects[videoId]
      if '$type' in video['title'] and video['title']['$type'] == 'error':
        error += 1
      elif 'value' in video['title'] and isinstance(video['title']['value'], str):
        value = video['title']['value'].strip()
        if value:
          videos[videoId] = {'title': value}
  except Exception as e:
    print(e)
    print('error ' + str(index))


# Ensures the ids are their own parent meaning they are proper titles or episodes
def get_titles(index, videos_cleaned, videos):
  data = {
      "path": '["videos", ' + dumps(index) + ', "parent"]'}
  try:
    response = post(url, json=data, headers=headers).json()
    objects = response['jsonGraph']['videos']
    for (videoId, video) in objects.items():
      if 'value' in video['parent'] and isinstance(video['parent']['value'], list) and len(video['parent']['value']) == 2 and video['parent']['value'][1] == videoId:
        videos_cleaned[videoId] = videos[videoId]
  except Exception as e:
    print(e)
    print(index[0])


def get_ids():
  videos = merge({}.fromkeys(['28369403',
                              '28630857',
                              '28631029',
                              '28631995',
                              '28634944'], {}), load(open(path.join(
                                  Path(__file__).parent.absolute(), 'data/video_ids.json'), 'r', encoding='utf-8')))
  ids = []
  # 60 000 000 to 82 000 000
  for i in range(5):  # 60_037_677
    index = 60_000_000 + i * 8000
    ids.append((index, 8000, videos))
  for i in range(39):  # 70_309_703
    index = 70_000_000 + i * 8000
    ids.append((index, 8000, videos))
  for i in range(496):  # 80 240 263
    index = 80_000_000 + i * 500
    ids.append((index, 500, videos))
  for i in range(3040):  # 80_986_788 - 81 290 762 = 303,974
    index = 80_986_788 + i * 100
    ids.append((index, 100, videos))
  threads(rangeCollect, ids, 0.02, 'Scanning ids')
  print(error)
  print('Collected ' + str(len(videos)) + ' ids')
  # with open('data/video_ids.json', 'w', encoding='utf-8') as outfile:
  #  dump(videos, outfile, ensure_ascii=False)

  videos_cleaned = load(
      open(path.join(
          Path(__file__).parent.absolute(), 'data/video_cleaned.json'), 'r', encoding='utf-8'))
  count = 0
  id_list = []
  for id in videos:
    if count % 150 == 0:
      if count != 0:
        id_list[-1] = [id_list[-1], videos_cleaned, videos]
      id_list.append([])
    id_list[-1].append(id)
    count += 1
  id_list[-1] = [id_list[-1], videos_cleaned, videos]
  threads(get_titles, id_list, 0.02, 'Purging ids')
  print('Collected ' + str(len(videos_cleaned)) + ' titles and trailers')
  with open(path.join(
          Path(__file__).parent.absolute(), 'data/video_cleaned.json'), 'w', encoding='utf-8') as outfile:
    dump(videos_cleaned, outfile, ensure_ascii=False)
  return videos_cleaned


# get_ids()

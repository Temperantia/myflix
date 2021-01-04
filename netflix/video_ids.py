
from requests import post
from json import dump, dumps, load
from time import sleep
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
        if error == 1:
          print(response)

      if 'value' in video['title'] and isinstance(video['title']['value'], str):
        value = video['title']['value'].strip()
        if value:
          videos[videoId] = {}
  except:
    print('error ' + str(index))
    # print(videoId + ' : ' + value)


def get_ids():
  videos = {}.fromkeys(['28369403',
                        '28630857',
                        '28631029',
                        '28631995',
                        '28634944'], {}) | load(open('data/video_ids.json', 'r'))
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

  threads(rangeCollect, ids, 0.02)
  print(error)
  print('Collected ' + str(len(videos)) + ' ids')
  with open('data/video_ids.json', 'w') as outfile:
    dump(videos, outfile, ensure_ascii=False)
  return videos

#get_ids()

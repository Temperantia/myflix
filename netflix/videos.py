
from requests import post
from json import dump, dumps, load
from time import sleep
from threads import threads
from netflix import url, headers
from video_summary import get_summary
from jsonmerge import merge
from get_media import media


def listUntilEmpty(data, k=None):
  l = []
  for key in data:
    obj = data[key]
    if k is not None:
      if not 'value' in obj[k]:
        break
      l.append(obj[k]['value'])

    else:
      if not 'value' in obj:
        break
      l.append(obj['value'])
  return l


def find_genre_name(genre_id, genre_dict):
  for genre in genre_dict:
    if genre == genre_id:
      return genre_dict[genre]
  return ''


def fetchVideo(id, shows, genre_dict):
  # print('Collecting ' + id[0] + ' to ' + id[-1])
  data = {
      "path": """["videos", """ + dumps(id) + """, ["title", "synopsis", "seasonCount", "episodeCount", "releaseYear", "maturity", "availability", "genres", "moodTags", "creators", "directors", "writers", "cast"],{"from":0,"to":3},["name"] ]"""}
  try:
    response = post(url, json=data, headers=headers).json()
    objects = response['jsonGraph']['videos']
    people = response['jsonGraph']['person'] if 'person' in response['jsonGraph'] else [
    ]
    data = {
        "path": """["videos", """ + dumps(id) + """, "boxarts","_1920x1080", "png"]"""}
    response = post(url, json=data, headers=headers).json()
    boxArts = response['jsonGraph']['videos']
    data = {
        "path": """["videos", """ + dumps(id) + """, "storyArt","_1920x1080", "png"]"""}
    response = post(url, json=data, headers=headers).json()
    storyArts = response['jsonGraph']['videos']

    for (videoId, video) in objects.items():
      if not 'value' in video['title']:
        continue
      title = video['title']['value'] if 'title' in video else None
      boxArt = boxArts[videoId]['boxarts']['_1920x1080']['png']['value']['url']
      storyArt = storyArts[videoId]['storyArt']['_1920x1080']['png']['value'][
          'url'] if 'value' in storyArts[videoId]['storyArt']['_1920x1080']['png'] else None
      synopsis = video['synopsis']['value'] if 'synopsis' in video else None
      seasonCount = video['seasonCount']['value'] if 'seasonCount' in video else None
      episodeCount = video['episodeCount']['value'] if 'episodeCount' in video else None
      releaseYear = video['releaseYear']['value'] if 'releaseYear' in video else None
      maturity = video['maturity']['value']['rating']['value'] if 'maturity' in video and 'value' in video['maturity']['value']['rating'] else None
      availability = video['availability']['value'] if 'availability' in video else None
      genres = listUntilEmpty(
          video['genres']) if 'genres' in video else []
      genres = [{'id': genre[1], 'name': find_genre_name(
          genre[1], genre_dict)} for genre in genres]
      moodTags = listUntilEmpty(
          video['moodTags'], 'name') if 'moodTags' in video else []
      creators = listUntilEmpty(
          video['creators']) if people and 'creators' in video else []
      creators = [people[id[1]]['name']['value'] for id in creators]
      directors = listUntilEmpty(
          video['directors']) if people and 'directors' in video else []
      directors = [people[id[1]]['name']['value'] for id in directors]
      writers = listUntilEmpty(
          video['writers']) if people and 'writers' in video else []
      writers = [people[id[1]]['name']['value'] for id in writers]
      cast = listUntilEmpty(
          video['cast']) if people and 'cast' in video else []
      cast = [people[id[1]]['name']['value'] for id in cast]
      shows[videoId].update({
          'title': title,
          'synopsis': synopsis,
          'boxArt': boxArt,
          'storyArt': storyArt,
          'seasonCount': seasonCount,
          'episodeCount': episodeCount,
          'releaseYear': releaseYear,
          'maturity': maturity,
          'availability': availability,
          'genres': genres,
          'moodTags': moodTags,
          'creators': creators,
          'directors': directors,
          'writers': writers,
         # 'actors': cast
      })
  except:
    print('error ' + str(id))


def get_videos():

  genre_dict = load(open('data/genres.json', 'r', encoding='utf-8'))

  #shows = merge(get_summary(), load(open('data/videos.json', 'r', encoding='utf-8')))
  shows = merge({}, load(open('data/videos.json', 'r', encoding='utf-8')))
  showCount = 0
  movieCount = 0
  count = 0
  id_list = []
  for id in shows:
    if shows[id]['summary']['type'] == 'movie':
      movieCount += 1
    if shows[id]['summary']['type'] == 'show':
      showCount += 1
    if count % 150 == 0:
      id_list.append([])
    id_list[-1].append(id)
    count += 1

  print(id_list[0])
  ids = []
  for id in id_list:
    ids.append([id, shows, genre_dict])
  threads(fetchVideo, ids, 0.02)
  shows = get_media(shows)
  print('Collected ' + str(showCount) +
        ' shows and ' + str(movieCount) + ' movies')
  dump(shows, open('data/videos.json', 'w', encoding='utf-8'),
       ensure_ascii=False, indent=2, sort_keys=True)


get_videos()

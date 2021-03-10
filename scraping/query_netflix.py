
from typing import Dict, List
from requests import post
from json import dumps
from slugify import slugify


from utils import threads, file
from key import netflix
from video_summary import get_summary

REFRESH_IDS = False

types = {}
title_ids: Dict[int, int] = {}

f: Dict[str, Dict[str, str]] = file.read_json('data/genres_tagged.json')
genre_dict: Dict[str, List[str]] = {}
for category in f:
  for genre_id in f[category]:
    genre = f[category][genre_id]
    if not genre in genre_dict:
      genre_dict[genre] = []
    genre_dict[genre].append(category)


def list_until_empty(data, k=None):
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


def create_route(title: str, type: str, id: int) -> str:
  global types, title_ids

  route = ('/tvshows/' if type == 'show' else '/films/') + \
      slugify(title + ('-' + str(id) if id > 0 else '')) + '/overview'
  if route in types and types[route] == type:
    if not id in title_ids:
      title_ids[id] = 1
    else:
      title_ids[id] += 1
    route = create_route(title, type, title_ids[id] + 1)
  types[route] = type
  return route


def find_categories(genres: Dict[str, str]):
  categories: List[str] = []
  for genre in genres:
    categories += genre_dict[genre]
  return categories


def fetch_video(video_id, shows, genre_dict):
  #print('Collecting ' + id[0] + ' to ' + id[-1])
  data = {
      "path": """["videos", """ + dumps(video_id) + """, ["title", "synopsis", "seasonCount", "episodeCount", "releaseYear", "maturity", "availability", "genres", "moodTags", "creators", "directors", "writers", "cast"],{"from":0,"to":3},["name"] ]"""}
  try:
    response = post(netflix.url, json=data, headers=netflix.headers).json()
    objects = response['jsonGraph']['videos']
    people = response['jsonGraph']['person'] if 'person' in response['jsonGraph'] else [
    ]
    data = {
        "path": """["videos", """ + dumps(video_id) + """, "boxarts","_1920x1080", "png"]"""}
    response = post(netflix.url, json=data, headers=netflix.headers).json()
    boxArts = response['jsonGraph']['videos']
    data = {
        "path": """["videos", """ + dumps(video_id) + """, "storyArt","_1920x1080", "png"]"""}
    response = post(netflix.url, json=data, headers=netflix.headers).json()
    storyArts = response['jsonGraph']['videos']

    for video_id, video in objects.items():
      if not 'title' in video or not video['title'] or not 'value' in video['title'] or not video['title']['value']:
        continue
      title = video['title']['value']
      boxArt = boxArts[video_id]['boxarts']['_1920x1080']['png']['value']['url']
      storyArt = storyArts[video_id]['storyArt']['_1920x1080']['png']['value'][
          'url'] if 'value' in storyArts[video_id]['storyArt']['_1920x1080']['png'] else None
      synopsis = video['synopsis']['value'] if 'synopsis' in video else None
      seasonCount = video['seasonCount']['value'] if 'seasonCount' in video else None
      episodeCount = video['episodeCount']['value'] if 'episodeCount' in video else None
      releaseYear = video['releaseYear']['value'] if 'releaseYear' in video else None
      maturity = video['maturity']['value']['rating']['value'] if 'maturity' in video and 'value' in video['maturity']['value']['rating'] else None
      availability = video['availability']['value'] if 'availability' in video else None
      genres = list_until_empty(
          video['genres']) if 'genres' in video else []
      genres = [find_genre_name(genre[1], genre_dict) for genre in genres]
      moodTags = list_until_empty(
          video['moodTags'], 'name') if 'moodTags' in video else []
      creators = list_until_empty(
          video['creators']) if people and 'creators' in video else []
      creators = [people[id[1]]['name']['value'] for id in creators]
      directors = list_until_empty(
          video['directors']) if people and 'directors' in video else []
      directors = [people[id[1]]['name']['value'] for id in directors]
      writers = list_until_empty(
          video['writers']) if people and 'writers' in video else []
      writers = [people[id[1]]['name']['value'] for id in writers]
      cast = list_until_empty(
          video['cast']) if people and 'cast' in video else []
      cast = [people[id[1]]['name']['value'] for id in cast]
      shows[video_id].update({
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
          'route': create_route(title, shows[video_id]['summary']['type'], 0),
          'categories': find_categories(genres),
      })
    # if not 'exists' in video:

  except Exception as e:
    print(e, 'error ' + video_id)


def get_videos(videos):
  genre_dict = file.read_json('data/genres.json')

  videos.update(file.read_json('data/video_summary.json'))
  if REFRESH_IDS:
    videos = videos.update(get_summary())


  show_count = 0
  movie_count = 0
  count = 0
  id_list = []
  for id in videos:
    if not 'summary' in videos[id]:
      continue
    if videos[id]['summary']['type'] == 'movie':
      movie_count += 1
    if videos[id]['summary']['type'] == 'show':
      show_count += 1
    if count % 150 == 0:
      id_list.append([])
    id_list[-1].append(id)
    count += 1

  args = [[id, videos, genre_dict] for id in id_list]
  threads.threads(fetch_video, args, 0.02, 'Fetching titles')

  print('Collected ' + str(show_count) +
        ' shows and ' + str(movie_count) + ' movies')

  file.write_json('data/videos.json', videos)


if __name__ == '__main__':
  get_videos()

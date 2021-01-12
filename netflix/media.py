from requests import post
from threads import threads
from json import load, dump

titles = {}

def request(id):
  global titles
  data = {
      'operationName': 'getOriginalHook',
      'variables': {
          'country': 'US',
          'locale': 'en',
          'movieId': str(id)
      },
      'query': 'query getOriginalHook($movieId: String!, $locale: String!, $country: String) { original(movieId: $movieId, locale: $locale) { description image(size: LARGE, locale: $locale, country: $country) { url }}}'
  }
  try:
    response = post('https://media.netflix.com/graphql', json=data)
    if response.status_code != 200:
      return
    response = response.json()
    if response and 'data' in response and 'original' in response['data'] and 'description' in response['data']['original'] and response['data']['original']['description']:
      titles[id]['synopsis'] = response['data']['original']['description']
      titles[id]['originalBoxArt'] = response['data']['original']['image']['url']
  except Exception as e:
    print(e)
    print('error ', id)
  return titles

def get_media(t):
  global titles
  titles = t
  ids = []
  for id in titles:
    if titles[id]['summary']['isOriginal']:
      ids.append([id])
  threads(request, ids, 0.02)
  return titles


#titles = load(open('data/videos.json', 'r', encoding='utf-8'))
#launch(titles)

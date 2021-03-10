from requests import post

def request_media(id):
  title = {}
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
      return title
    response = response.json()
    if response and 'data' in response and 'original' in response['data'] and 'description' in response['data']['original'] and response['data']['original']['description']:
      title['synopsis'] = response['data']['original']['description']
      title['originalBoxArt'] = response['data']['original']['image']['url']
  except Exception:
    print('error ', id)
  return title



from typing import Any, Dict
from urllib.request import urlopen
from random import randint
from bs4 import BeautifulSoup

from utils import firebase, threads


base_url = 'https://www.imdb.com'
names = open('constant/john.txt', 'r').read().split('\n')


def reviews_page(id: str, video: Dict[str, Any]):
  soup = BeautifulSoup(urlopen(base_url + '/title/tt' +
                               video['IMDbID'] + '/reviews').read(), 'html.parser')
  reviews = soup.find_all(class_='imdb-user-review')
  review_count = 0
  for review in reviews:
    rating = None
    try:
      rating = int(review.find(
          class_='rating-other-user-rating').find('span').text)
    except:
      continue
    content = review.find(class_='text').text
    if len(reviews) <= 2 or (rating >= 8 and len(content) <= 1000):
      author_index = randint(0, 999)
      firebase.reviews_collection.add({
          'bot': True,
          'author': {
              'id': author_index,
              'username': names[author_index],
              'image': None
          },
          'title': {
              'id': int(id),
              'type': video['summary']['type'],
              'route': video['route'],
              'title': video['title'],
              'boxArt': video['boxArt'],
              'Poster': video['Poster'] if 'Poster' in video else video['boxArt']
          },
          'content': content,
          'ratings': {
              'Acting': rating,
              'Enjoyment': rating,
              'Overall': rating,
              'Plot': rating,
              'Sound': rating,
              'Visuals': rating
          },
          'reports': [],
          'likes': [],
          'postedOn': firebase.firestore.SERVER_TIMESTAMP
      })
      review_count += 1
    if review_count >= randint(1, 2):
      break


def imdb(id: str, video: Dict[str, Any]):
  if 'IMDbID' not in video or not video['IMDbID']:
    return

  try:
    reviews_page(id, video)
  except Exception as e:
    print(id, e)


print('Getting videos')
args = [[id, video]
        for id, video in firebase.get_collection(firebase.video_collection)]

threads.threads(imdb, args, 0, 'Scraping IMDB')

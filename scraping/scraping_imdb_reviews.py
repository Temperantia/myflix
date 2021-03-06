from urllib.request import urlopen
from threads import threads
from firebase import get_collection, video_collection, reviews_collection, firestore
from random import randint
from bs4 import BeautifulSoup

DEBUG = True


base_url = 'https://www.imdb.com'
videos = {}
names = open('john.txt', 'r').read().split('\n')


def reviews_page(id, video):
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
      reviews_collection.add({
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
          'postedOn': firestore.SERVER_TIMESTAMP
      })
      review_count += 1
    if review_count >= randint(1, 2):
      break


def imdb(id, video):
  if 'IMDbID' not in video or not video['IMDbID']:
    return

  try:
    reviews_page(id, video)
  except Exception as e:
    print(id, e)


def launch():
  print('Getting videos')
  for video in get_collection(video_collection, []):
    videos[video.id] = video.to_dict()

  for(id, video) in videos.items():
    imdb(id, video)


if DEBUG:
  launch()

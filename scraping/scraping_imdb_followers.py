from urllib.request import urlopen
from random import randint
from bs4 import BeautifulSoup

from threads import threads
from firebase import get_collection, video_collection


base_url = 'https://www.imdb.com'


def reviews_page(id, video):
  soup = BeautifulSoup(urlopen(base_url + '/title/tt' +
                               video['IMDbID']).read(), 'html.parser')
  followers = soup.find(itemprop='ratingCount')
  if followers:
    video_collection.document(id).update(
        {'IMDbFollowers': int(followers.text.replace(',', ''))})


def imdb(id, video):
  if 'IMDbID' not in video or not video['IMDbID']:
    return

  try:
    reviews_page(id, video)
  except Exception as e:
    print(id, e)


def launch():
  print('Getting videos')
  threads(imdb, [[video.id, video.to_dict()]
                 for video in get_collection(video_collection, [])], 0.02)


launch()

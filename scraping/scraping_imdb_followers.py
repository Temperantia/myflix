from urllib.request import urlopen
from bs4 import BeautifulSoup

from utils import threads, firebase


base_url = 'https://www.imdb.com'


def reviews_page(id, video):
  soup = BeautifulSoup(urlopen(base_url + '/title/tt' +
                               video['IMDbID']).read(), 'html.parser')
  followers = soup.find(itemprop='ratingCount')
  if followers:
    firebase.video_collection.document(id).update(
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
  threads(imdb, [[id, video]
                 for id, video in firebase.get_collection(firebase.video_collection)], 0.3)


launch()

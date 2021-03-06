from urllib.parse import quote_plus
from selenium import webdriver
from selenium.webdriver.firefox.options import Options as OptionsFirefox
from selenium.webdriver.chrome.options import Options as OptionsChrome
from json import load, dump
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from time import perf_counter
from threads import threads
from firebase import get_collection, video_collection, reviews_collection, firestore
from random import randint

DEBUG = True

BROWSER = 'firefox'
BROWSER_NUM = 5
TIME_OUT = 5

base_url = 'https://www.imdb.com'
options = OptionsFirefox() if BROWSER == 'firefox' else OptionsChrome()
options.add_argument('--headless')
options.add_argument('log-level=2')
browsers = []
data = {}
videos = {}
names = open('john.txt', 'r').read().split('\n')


def reviews_page(browser, id, video):
  browser.get(base_url + '/title/tt' + video['IMDbID'] + '/reviews')
  WebDriverWait(browser, TIME_OUT).until(
      EC.presence_of_element_located((By.CLASS_NAME, 'pagecontent')))
  reviews = browser.find_elements_by_class_name('imdb-user-review')
  review_count = 0
  for review in reviews:
    rating = int(review.find_element_by_class_name(
        'rating-other-user-rating').find_element_by_tag_name('span').get_attribute('innerHTML'))
    content = review.find_element_by_class_name('text').get_attribute('innerHTML')
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


def imdb(index, id, video):
  if 'IMDbID' not in video:
    return
  browser = browsers[index % BROWSER_NUM]

  reviews_page(browser, id, video)


def launch():
  for i in range(BROWSER_NUM):
    if BROWSER == 'firefox':
      browsers.append(webdriver.Firefox(options=options))
    else:
      browsers.append(webdriver.Chrome(options=options))

  for video in get_collection(video_collection, []):
    videos[video.id] = video.to_dict()

  threads(imdb, [[index, id, video] for index, (id, video) in enumerate(videos.items())], 0.02)

  for browser in browsers:
    browser.close()


if DEBUG:
  launch()

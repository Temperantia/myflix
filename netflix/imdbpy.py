import time
import json
import imdb
from threads import threads

credits = {}
search = []

with open('data/videos.json', 'r', encoding="UTF-8") as file:
  data = json.load(file)
  for element in data:
    if (data[element]['releaseYear']) == 0:
      pass
    else:
      search.append([data[element]['title'] +
                     ' ('+str(data[element]['releaseYear'])+')', credits])

db = imdb.IMDb(accessSystem='https', reraiseExceptions=True)


def get_credits(search, credits):

  production_name = []
  distributor_name = []
  special_effects_name = []
  other_companies_name = []
  poster_url = []
  synopsis = []

  try:
    movies = db.search_movie(search)
    time.sleep(0.5)

    if len(movies) > 0:
      movie = movies[0]
      db.update(movie)

      if 'production companies' in movie.keys():
        production = movie['production companies']
        for element in production:
          production_name.append(element['name'])
      else:
        production_name.append(None)

      if 'distributors' in movie.keys():
        distributor = movie['distributors']
        for element in distributor:
          distributor_name.append(element['name'])
      else:
        distributor_name.append(None)

      if 'special effects' in movie.keys():
        special_effects = movie['special effects']
        for element in special_effects:
          special_effects_name.append(element['name'])
      else:
        special_effects_name.append(None)

      if 'other companies' in movie.keys():
        other_companies = movie['other companies']
        for element in other_companies:
          other_companies_name.append(element['name'])
      else:
        other_companies_name.append(None)

      if 'full-size cover url' in movie.keys():
        poster_url.append('full-size cover url')
      else:
        poster_url.append(None)

      if 'plot' in movie.keys():
        synopsis.append(movie['plot'][0])
      else:
        synopsis.append(None)

    credits[search] = {
        'Production companies': production_name,
        'Distributor companies': distributor_name,
        'Special effects': special_effects_name,
        'Other companies':  other_companies_name,
        'Poster url': poster_url,
        'Synopsis': synopsis
    }
  except :
    print('e')


threads(get_credits, search, 0.5)

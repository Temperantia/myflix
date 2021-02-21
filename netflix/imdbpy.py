import imdb
from time import sleep

db = imdb.IMDb(accessSystem='https', reraiseExceptions=True)


def get_imdb_data(title):
  obj = {}

  try:
    movies = db.search_movie(f'{title}')
    if len(movies) > 0:
      movie = movies[0]
      keys = movie.keys()
      db.update(movie)
      obj = {
          'OriginalTitle': movie['original title'] if 'original title' in keys else None,
          'LongIMDbTitle': movie['long imdb title'] if 'long imdb title' in keys else None,
          'IMDbID': movie['imdbID'] if 'imdbID' in keys else None,
          'Poster': movie['full-size cover url'] if 'full-size cover url' in keys else None,
          'Production companies': movie['production companies'] if 'production companies' in keys else None,
          'Distributor companies': movie['distributors'] if 'distributors' in keys else None,
          'SpecialEffects': movie['special effects'] if 'special effects' in keys else None,
          'OtherCompanies': movie['other companies'] if 'other companies' in keys else None,
          'Rating': movie['rating'] if 'rating' in keys else None,
          'Countries': movie['countries'] if 'countries' in keys else None,
          'Languages': movie['languages'] if 'languages' in keys else None,
      }

      if 'plot outline' in keys:
        obj['PlotOutline'] = movie['plot outline']

      if 'plot' in keys:
        temp = str(movie['plot']).split('::')
        obj['Plot'] = temp[0].replace("['", "")

      if 'cast' in keys:
        actor_name = []
        actor_role = []
        for actor in movie['cast']:
          actor_name.append(actor['name'])
          actor_role.append(actor.currentRole['name'])
        obj['Actors'] = {
            'Name': actor_name,
            'Role': actor_role
        }
    return obj

  except Exception as e:
    print(e)
    return {}

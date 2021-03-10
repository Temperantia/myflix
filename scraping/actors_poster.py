import imdb
import json
import time
from threads import threads
import meilisearch
from firebase import db as database, get_collection


client = meilisearch.Client('https://search.my-flix.net')
# client.create_index('actors', {'primaryKey': 'actor_name'})

video_database = get_collection(database.collection('videos'))

dico = []

for doc in video_database:
  video = doc.to_dict()
  if video['releaseYear'] ==0 or video['title'] =='' or video['releaseYear'] ==0 and video['title'] =='':
    pass
  else:
    dico.append([video['title']])

db = imdb.IMDb(accessSystem='https', reraiseExceptions=True)

def get_poster(title):

	try:
		movies = db.search_movie(f'{title}')
		time.sleep(0.3)
		if len(movies) > 0:
			movie = movies[0]
			db.update(movie, 'full credits')
      time.sleep(0.3)
			if 'cast' in movie.keys():
				for actor in movie['cast']:
					client.index('actors').add_documents([{
						'actor_name': str(actor['name']) if 'name' in actor.keys() else None,
						'poster': str(actor['full-size headshot']) if 'full-size headshot' in actor.keys() else None
							}])
	except:
		print('e')

threads(get_poster, dico, 0.3)

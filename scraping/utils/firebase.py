from firebase_admin import credentials, firestore, initialize_app

cred = credentials.Certificate(
    'key/myflix-prod-firebase-adminsdk-un9jx-59d53b5c76.json')
initialize_app(cred)
db = firestore.client()
video_collection = db.collection('videos')
data_collection = db.collection('data')
genre_collection = db.collection('genres')
stats_collection = db.collection('stats')
globals_collection = db.collection('globals')
users_collection = db.collection('users')
reviews_collection = db.collection('reviews')


limit = 1000  # Reduce this if it uses too much of your RAM


def get_collection(collection, cursor=None):
  data = {}
  while True:
    query = collection.limit(limit)
    if cursor:
      query = query.start_after(cursor)
    docs = [snapshot for snapshot in query.stream()]
    data.update({snapshot.id: snapshot.to_dict() for snapshot in docs})
    if len(docs) == limit:
      print('1000 docs fetched')

      cursor = docs[limit-1]
      continue
    print('Finished fetching')
    return data


def get_collectione(coll_ref, collection, cursor=None):
  if cursor is not None:
    docs = [snapshot for snapshot
            in coll_ref.limit(1000).start_after(cursor).stream()]
  else:
    docs = [snapshot for snapshot
            in coll_ref.limit(1000).stream()]

  collection = collection + docs

  if len(docs) == 1000:
    print('1000 docs fetched')
    return get_collection(coll_ref, collection, docs[999])
  else:
    print('Finished fetching')
    return collection

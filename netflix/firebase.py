from firebase_admin import credentials, firestore, initialize_app
from os import path
from pathlib import Path

# prototype
cred = credentials.Certificate(
   path.join(
    Path(__file__).parent.absolute(), 'my-flix-91e46-firebase-adminsdk-tx9sq-c48bb4e2a9.json'))
# dev
# cred = credentials.Certificate(
#    path.join(Path(__file__).parent.absolute(), 'myflix-dev-firebase-adminsdk-54m6q-5162a29bbe.json'))
# prod
#cred = credentials.Certificate(
 #   path.join(Path(__file__).parent.absolute(), 'myflix-prod-firebase-adminsdk-un9jx-59d53b5c76.json'))
initialize_app(cred)
db = firestore.client()
video_collection = db.collection('videos')
data_collection = db.collection('data')
genre_collection = db.collection('genres')
stats_collection = db.collection('stats')


def get_collection(coll_ref, collection, cursor=None):
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

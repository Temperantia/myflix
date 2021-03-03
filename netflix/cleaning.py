import firebase_admin
from firebase_admin import credentials, firestore, initialize_app

cred = credentials.Certificate(
  'my-flix-91e46-firebase-adminsdk-tx9sq-c48bb4e2a9.json')

initialize_app(cred)
db = firestore.client()

docs = db.collection('videos').get()

for doc in docs:
    key = doc.id
    db.collection('videos').document(key).update({"Actors.Name": firestore.DELETE_FIELD, "Actors.Role": firestore.DELETE_FIELD})
    

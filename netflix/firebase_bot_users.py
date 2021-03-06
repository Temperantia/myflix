from firebase import users_collection
from firebase_admin import firestore
from threads import threads

names = open('john.txt', 'r').read().split('\n')

def create_bot_user(index):
  name = names[index]
  users_collection.document(str(index)).set({
    'bot': True,
    'email': None,
    'username': name,
    'usernameLower': name,
    'image': None,
    'reviews': [],
    'suggestions': [],
    'flixlist': {},
    'favorites': {'films': {}, 'shows': {}},
    'created': firestore.SERVER_TIMESTAMP,
    'providers': {}
  })

threads(create_bot_user, [[index] for index in range(1000)], 0, 'Creating bots')

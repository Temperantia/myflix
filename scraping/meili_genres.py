import meilisearch
from utils import file

client = meilisearch.Client('https://search.my-flix.net')
genre_index = client.index('genres')
dict_genres = file.read_json('data/genres_tagged.json')

documents = []
for category in dict_genres:
  for genre_id in dict_genres[category]:
    documents.append({
        'id': genre_id,
        'genre': dict_genres[category][genre_id],
        'category': category
    })
genre_index.add_documents(documents)

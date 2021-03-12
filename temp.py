import imdb

db = imdb.IMDb(accessSystem='https', reraiseExceptions=True)

search = db.search_movie_advanced('Money Heist')

db.update(search[0])

movie = search[0]

a = {
    "title": movie['title'],
    "original title": movie['original title'],
    "canonical title": movie['canonical title'],
    "long imdb title": movie['long imdb title'],
    "long imdb canonical title": movie['long imdb canonical title'],
    "smart canonical title": movie['smart canonical title'],
    "smart long imdb canonical title": movie['smart long imdb canonical title']
}

print(a)

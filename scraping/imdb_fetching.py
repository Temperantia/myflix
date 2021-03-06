import imdb
from time import time

db = imdb.IMDb()

year = ''
title = ""
begin = time()

movies = db.search_movie(f"The Queen's Gambit (2020)")


print('finis')
end = time()

print(f'Done in {round(end-begin, 2)}')

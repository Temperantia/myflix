from datetime import datetime
from imdb import launch

while True:
  date_time_str = '2020-12-13 20:10:00.243860'
  date_time_obj = datetime.strptime(date_time_str, '%Y-%m-%d %H:%M:%S.%f')

  if datetime.timestamp(datetime.now()) >  datetime.timestamp(date_time_obj):
      launch()
      break
from firebase import video_collection
from json import dump

videos = {}
after = 28630857

while '81290263' not in videos:
  print(after)
  docs = video_collection.order_by('summary.id').start_at({'summary.id': after}).limit(100).stream()
  for video in docs:
    videos[video.id] = video.to_dict()
  after = int(list(videos)[-1])
dump(videos, open('data/videos.json', 'w', encoding='utf-8'), ensure_ascii=False, sort_keys=True, indent=2)

from firebase import get_collection, video_collection

for video in get_collection(video_collection, []):
  video_collection.document(video.id).update({'favorites': []})

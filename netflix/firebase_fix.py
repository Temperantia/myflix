from firebase import video_collection

for video in video_collection.stream():
  video_collection.document(video.id).set({'followers': {}}, merge=True)

from firebase.firebase_config import db

collections = db.collections()

for collection in collections:
    print(collection.id)
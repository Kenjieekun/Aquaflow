import firebase_admin
from firebase_admin import credentials, firestore

# Prevent Firebase from being initialized multiple times
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase/serviceAccountKey.json")
    firebase_admin.initialize_app(cred)

# Firestore database instance
db = firestore.client()
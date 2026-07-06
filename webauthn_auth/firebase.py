import firebase_admin

from firebase_admin import credentials
from firebase_admin import firestore

from django.conf import settings


if not firebase_admin._apps:

    cred = credentials.Certificate(
        settings.FIREBASE_ADMIN_SDK
    )

    firebase_admin.initialize_app(cred)


db = firestore.client()
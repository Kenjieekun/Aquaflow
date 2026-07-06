from django.db import models


class WebAuthnCredential(models.Model):
    firebase_uid = models.CharField(max_length=255)
    credential_id = models.TextField(unique=True)
    public_key = models.BinaryField()
    sign_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.firebase_uid
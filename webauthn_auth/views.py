import json

from webauthn.helpers import options_to_json

from .utils import create_registration_options

from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
@require_POST
def begin_registration(request):

    body = json.loads(request.body)

    firebase_uid = body["firebaseUid"]

    email = body["email"]

    display_name = body.get(
        "displayName",
        "Administrator",
    )

    options = create_registration_options(

        firebase_uid,

        email,

        display_name,

    )

    request.session["registration_challenge"] = (
        options.challenge.hex()
    )

    request.session["firebase_uid"] = firebase_uid

    return JsonResponse(

        json.loads(

            options_to_json(options)

        )

    )


@csrf_exempt
@require_POST
def finish_registration(request):
    return JsonResponse({
        "success": True
    })


@csrf_exempt
@require_POST
def begin_authentication(request):
    return JsonResponse({
        "success": True
    })


@csrf_exempt
@require_POST
def finish_authentication(request):
    return JsonResponse({
        "success": True
    })
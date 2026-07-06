from django.urls import path

from . import views

urlpatterns = [

    # Registration
    path(
        "register/begin/",
        views.begin_registration,
        name="begin_registration",
    ),

    path(
        "register/finish/",
        views.finish_registration,
        name="finish_registration",
    ),

    # Authentication
    path(
        "authenticate/begin/",
        views.begin_authentication,
        name="begin_authentication",
    ),

    path(
        "authenticate/finish/",
        views.finish_authentication,
        name="finish_authentication",
    ),

]
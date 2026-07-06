import os
import random
import time

from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST


# ==========================================
# CUSTOMER PAGES
# ==========================================

def login_view(request):
    return render(request, "accounts/login.html")


def index(request):
    return render(request, "accounts/index.html")


def register_view(request):
    return render(request, "accounts/register.html")


def dashboard(request):
    return render(request, "accounts/dashboard.html")


def products(request):
    return render(request, "accounts/products.html")


def orders(request):
    return render(request, "accounts/orders.html")


def profile(request):
    return render(request, "accounts/profile.html")


def settings_view(request):
    return render(request, "accounts/settings.html")


# ==========================================
# HELPERS
# ==========================================

def get_product_images():

    image_folder = os.path.join(
        settings.BASE_DIR,
        "accounts",
        "static",
        "accounts",
        "images",
        "products"
    )

    if not os.path.exists(image_folder):
        return []

    return sorted(

        file

        for file in os.listdir(image_folder)

        if file.lower().endswith(
            (".png", ".jpg", ".jpeg", ".webp")
        )

    )


# ==========================================
# ADMIN PAGES
# ==========================================

def admin_dashboard(request):
    return render(
        request,
        "accounts/admin_dashboard.html"
    )


def admin_products(request):

    context = {

        "product_images": get_product_images()

    }

    return render(
        request,
        "accounts/admin_products.html",
        context
    )


def admin_archived_orders(request):
    return render(
        request,
        "accounts/admin_archived_orders.html"
    )


def admin_orders(request):
    return render(
        request,
        "accounts/admin_orders.html"
    )


def admin_customers(request):
    return render(
        request,
        "accounts/admin_customers.html"
    )


def admin_reports(request):
    return render(
        request,
        "accounts/admin_reports.html"
    )


def admin_settings(request):
    return render(
        request,
        "accounts/admin_settings.html"
    )


def admin_audit_logs(request):
    return render(
        request,
        "accounts/admin_audit_logs.html"
    )


# ==========================================
# ADMIN OTP
# ==========================================

@require_POST
def send_admin_otp(request):

    otp = str(random.randint(100000, 999999))

    request.session["admin_otp"] = otp

    request.session["admin_otp_time"] = int(time.time())

    subject = "AquaFlow Admin Verification Code"

    message = f"""
Your One-Time Password (OTP) is:

{otp}

This code will expire in 5 minutes.

If you did not request this verification, you can ignore this email.
"""

    send_mail(

        subject,

        message,

        settings.EMAIL_HOST_USER,

        [settings.EMAIL_HOST_USER],

        fail_silently=False

    )

    return JsonResponse({

        "success": True,

        "message": "OTP sent successfully."

    })


@require_POST
def verify_admin_otp(request):

    otp = request.POST.get("otp", "").strip()

    saved_otp = request.session.get("admin_otp")

    otp_time = request.session.get("admin_otp_time")

    if not saved_otp or not otp_time:

        return JsonResponse({

            "success": False,

            "message": "OTP has expired."

        })

    if int(time.time()) - otp_time > 300:

        request.session.pop("admin_otp", None)

        request.session.pop("admin_otp_time", None)

        return JsonResponse({

            "success": False,

            "message": "OTP expired."

        })

    if otp != saved_otp:

        return JsonResponse({

            "success": False,

            "message": "Invalid OTP."

        })

    request.session.pop("admin_otp", None)

    request.session.pop("admin_otp_time", None)

    return JsonResponse({

        "success": True,

        "message": "OTP verified."

    })
from django.contrib.auth import views as auth_views
from django.urls import path

from . import views


urlpatterns = [

    # ==================================================
    # HOME
    # ==================================================

    path("", views.index, name="index"),

    # ==================================================
    # AUTHENTICATION
    # ==================================================

    path("login/", views.login_view, name="login"),

    path("register/", views.register_view, name="register"),

    path(
        "password-reset/",
        auth_views.PasswordResetView.as_view(
            template_name="accounts/password_reset.html"
        ),
        name="password_reset",
    ),

    path(
        "password-reset/done/",
        auth_views.PasswordResetDoneView.as_view(
            template_name="accounts/password_reset_done.html"
        ),
        name="password_reset_done",
    ),

    path(
        "reset/<uidb64>/<token>/",
        auth_views.PasswordResetConfirmView.as_view(
            template_name="accounts/password_reset_confirm.html"
        ),
        name="password_reset_confirm",
    ),

    path(
        "reset/done/",
        auth_views.PasswordResetCompleteView.as_view(
            template_name="accounts/password_reset_complete.html"
        ),
        name="password_reset_complete",
    ),

    # ==================================================
    # CUSTOMER PAGES
    # ==================================================

    path("dashboard/", views.dashboard, name="dashboard"),

    path("products/", views.products, name="products"),

    path("orders/", views.orders, name="orders"),

    path("profile/", views.profile, name="profile"),

    path(
        "settings/",
        views.settings_view,
        name="settings",
    ),

    # ==================================================
    # ADMIN DASHBOARD
    # ==================================================

    path(
        "admin-panel/dashboard/",
        views.admin_dashboard,
        name="admin_dashboard",
    ),

    # ==================================================
    # ADMIN PRODUCTS
    # ==================================================

    path(
        "admin-panel/products/",
        views.admin_products,
        name="admin_products",
    ),

    # ==================================================
    # ADMIN ORDERS
    # ==================================================

    path(
        "admin-panel/orders/",
        views.admin_orders,
        name="admin_orders",
    ),

    path(
        "admin-panel/orders/archive/",
        views.admin_archived_orders,
        name="admin_archived_orders",
    ),

    # ==================================================
    # ADMIN CUSTOMERS
    # ==================================================

    path(
        "admin-panel/customers/",
        views.admin_customers,
        name="admin_customers",
    ),

    # ==================================================
    # ADMIN REPORTS
    # ==================================================

    path(
        "admin-panel/reports/",
        views.admin_reports,
        name="admin_reports",
    ),

    # ==================================================
    # ADMIN SETTINGS
    # ==================================================

    path(
        "admin-panel/settings/",
        views.admin_settings,
        name="admin_settings",
    ),

    path(
        "admin-panel/settings/send-otp/",
        views.send_admin_otp,
        name="send_admin_otp",
    ),

    path(
        "admin-panel/settings/verify-otp/",
        views.verify_admin_otp,
        name="verify_admin_otp",
    ),

    # ==================================================
    # ADMIN AUDIT LOGS
    # ==================================================

    path(
        "admin-panel/audit-logs/",
        views.admin_audit_logs,
        name="admin_audit_logs",
    ),

]
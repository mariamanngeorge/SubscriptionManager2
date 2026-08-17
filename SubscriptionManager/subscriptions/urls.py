from django.urls import path

from .views import (
    RegisterView,
    SubscriptionListCreateView,
    SubscriptionDetailView,
)


urlpatterns = [
    path(
        "register/",
        RegisterView.as_view(),
        name="register"
    ),

    path(
        "subscriptions/",
        SubscriptionListCreateView.as_view(),
        name="subscription-list-create"
    ),

    path(
        "subscriptions/<int:pk>/",
        SubscriptionDetailView.as_view(),
        name="subscription-detail"
    ),
]


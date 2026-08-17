from django.db import models
from django.contrib.auth.models import User
from datetime import date
from dateutil.relativedelta import relativedelta


class Subscription(models.Model):

    BILLING_CYCLES = [
        ("monthly", "Monthly"),
        ("annual", "Annual"),
    ]

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="subscriptions"
    )

    service_name = models.CharField(max_length=150)

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    billing_cycle = models.CharField(
        max_length=10,
        choices=BILLING_CYCLES,
        default="monthly"
    )

    last_payment_date = models.DateField(
        null=True,
        blank=True
    )

    next_payment_date = models.DateField(
        null=True,
        blank=True
    )

    auto_pay = models.BooleanField(
        default=False
    )

    reminder_days = models.PositiveIntegerField(
        default=3
    )

    end_date = models.DateField(
        null=True,
        blank=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def calculate_next_payment_date(self):

        if not self.last_payment_date:
            return None

        if self.billing_cycle == "monthly":
            return self.last_payment_date + relativedelta(months=1)

        if self.billing_cycle == "annual":
            return self.last_payment_date + relativedelta(years=1)

        return None

    def save(self, *args, **kwargs):

        self.next_payment_date = (
            self.calculate_next_payment_date()
        )

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.service_name} - ₹{self.amount}"
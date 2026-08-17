from rest_framework import serializers
from .models import Subscription
from django.contrib.auth.models import User


class SubscriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subscription

        fields = [
            'id',
            'service_name',
            'amount',
            'billing_cycle',
            'last_payment_date',
            'next_payment_date',
            'auto_pay',
            'reminder_days',
            'end_date',
            'is_active',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'next_payment_date',
            'created_at',
        ]

    def validate_reminder_days(self, value):

        if value < 0 or value > 30:
            raise serializers.ValidationError(
                "Reminder days must be between 0 and 30."
            )

        return value

    def validate_billing_cycle(self, value):

        if value not in ['monthly', 'annual']:
            raise serializers.ValidationError(
                "Billing cycle must be monthly or annual."
            )

        return value


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    class Meta:
        model = User

        fields = [
            'username',
            'email',
            'password',
        ]

    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )

        return user
import re
from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

    def validate_full_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Full name is required.')
        return value.strip()

    def validate_email(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Email is required.')
        email = value.strip()
        if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email):
            raise serializers.ValidationError('Enter a valid email address.')
        return email.lower()

    def validate_phone_number(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Phone number is required.')
        cleaned = re.sub(r'[^0-9+\-()\s]', '', value)
        if len(cleaned.replace(' ', '').replace('-', '').replace('(', '').replace(')', '').replace('+', '')) < 10:
            raise serializers.ValidationError('Phone number must contain at least 10 digits.')
        return cleaned.strip()

    def validate_roll_number(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Roll number is required.')
        return value.strip()

    def validate_percentage_cgpa(self, value):
        if value is None:
            return value
        if value < 0 or value > 100:
            raise serializers.ValidationError('Percentage/CGPA must be between 0 and 100.')
        return value

    def validate(self, attrs):
        email = attrs.get('email')
        roll_number = attrs.get('roll_number')
        instance = getattr(self, 'instance', None)

        if email:
            qs = Student.objects.filter(email__iexact=email)
            if instance:
                qs = qs.exclude(pk=instance.pk)
            if qs.exists():
                raise serializers.ValidationError({'email': 'A student with this email already exists.'})

        if roll_number:
            qs = Student.objects.filter(roll_number__iexact=roll_number)
            if instance:
                qs = qs.exclude(pk=instance.pk)
            if qs.exists():
                raise serializers.ValidationError({'roll_number': 'A student with this roll number already exists.'})

        return attrs

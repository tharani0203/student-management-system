from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class Student(models.Model):
    DEPARTMENTS = [
        ('CSE', 'CSE'),
        ('ECE', 'ECE'),
        ('EEE', 'EEE'),
        ('MECH', 'MECH'),
        ('CIVIL', 'CIVIL'),
        ('IT', 'IT'),
    ]
    YEARS = [('1', '1'), ('2', '2'), ('3', '3'), ('4', '4')]
    SECTIONS = [('A', 'A'), ('B', 'B'), ('C', 'C')]
    GENDERS = [('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')]
    STATUSES = [('Active', 'Active'), ('Inactive', 'Inactive')]

    student_id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    gender = models.CharField(max_length=20, choices=GENDERS, default='Male')
    date_of_birth = models.DateField(null=True, blank=True)
    department = models.CharField(max_length=20, choices=DEPARTMENTS)
    year = models.CharField(max_length=10, choices=YEARS)
    section = models.CharField(max_length=5, choices=SECTIONS)
    roll_number = models.CharField(max_length=50, unique=True)
    address = models.TextField(blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    admission_date = models.DateField(default=timezone.now)
    percentage_cgpa = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=STATUSES, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-student_id']
        db_table = 'students_student'

    def clean(self):
        super().clean()
        if not self.full_name or not self.full_name.strip():
            raise ValidationError({'full_name': 'Full name is required.'})
        if not self.email or not self.email.strip():
            raise ValidationError({'email': 'Email is required.'})
        if not self.phone_number or not self.phone_number.strip():
            raise ValidationError({'phone_number': 'Phone number is required.'})
        if not self.roll_number or not self.roll_number.strip():
            raise ValidationError({'roll_number': 'Roll number is required.'})
        if self.percentage_cgpa is not None and (self.percentage_cgpa < 0 or self.percentage_cgpa > 100):
            raise ValidationError({'percentage_cgpa': 'Percentage/CGPA must be between 0 and 100.'})

    def __str__(self):
        return f"{self.full_name} ({self.roll_number})"

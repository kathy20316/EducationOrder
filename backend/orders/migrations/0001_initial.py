# Generated by Django 4.2.20 on 2025-03-26 23:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('orderID', models.AutoField(primary_key=True, serialize=False)),
                ('orderItem', models.CharField(max_length=255)),
                ('orderDescription', models.TextField(blank=True, null=True)),
                ('orderDate', models.DateTimeField(auto_now_add=True)),
                ('subject', models.CharField(max_length=100)),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Completed', 'Completed'), ('Canceled', 'Canceled')], default='Pending', max_length=20)),
                ('price', models.DecimalField(decimal_places=2, max_digits=6)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='student_orders', to=settings.AUTH_USER_MODEL)),
                ('tutor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tutor_orders', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]

# Generated by Django 3.1.1 on 2020-11-22 12:49

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_auto_20201122_1242'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cancion',
            name='uri',
        ),
        migrations.AddField(
            model_name='cancion',
            name='mp3',
            field=models.FileField(default=django.utils.timezone.now, upload_to='songs'),
            preserve_default=False,
        ),
    ]

# Generated by Django 3.1.1 on 2020-11-25 11:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_cancion_vecesescuchada'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cancion',
            name='vecesEscuchada',
            field=models.IntegerField(default=1),
        ),
    ]
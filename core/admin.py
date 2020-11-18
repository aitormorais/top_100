from django.contrib import admin

# Register your models here.
from core.models import Estilo, Artista, Cancion

admin.site.register(Estilo)
admin.site.register(Artista)
admin.site.register(Cancion)
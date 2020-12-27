from django.contrib import admin

# Register your models here.
from core.models import Estilo, Artista, Cancion


class EstiloAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ['nombre']


class ArtistaAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ['nombre']


class CancionAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'estilo', 'artista')
    search_fields = ['nombre']


admin.site.register(Estilo, EstiloAdmin)
admin.site.register(Artista, ArtistaAdmin)
admin.site.register(Cancion, CancionAdmin)

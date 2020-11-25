from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('genero/', views.genero, name='genero'),
    path('genero/<str:nombre_genero>/', views.genero, name='genero'),
    path('artista/', views.artista, name='artista'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

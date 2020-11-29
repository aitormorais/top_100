from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('genero/', views.genero, name='genero'),
    path('genero/<str:nombre_genero>/', views.genero, name='genero'),
    path('artista/', views.artista, name='artista'),
    path('artista/<str:nombre_artista>/', views.artista, name='artista'),
    path('api/cancionEscuchada', views.cancionEscuchada, name='cancionEscuchada'),
    path('search/<str:nombre_cancion>/', views.busqueda, name='busqueda'),
    path('cancion/', views.cancion, name='cancion'),
    path('cancion/<str:nombre_cancion>/', views.cancion, name='cancion'),
    path('login/user/', views.welcome),
    path('welcome/', views.register),
    path('login/', views.login),
    path('register/', views.register),
    path('logout/', views.logout),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

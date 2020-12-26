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
    path('api/caratula', views.caratula, name='caratula'),
    path('api/ImgPopUp/<int:pk>', views.popUp, name='popup'),
    path('search/<str:nombre_cancion>/', views.busqueda, name='busqueda'),
    path('cancion/', views.cancion, name='cancion'),
    path('cancion/<str:nombre_cancion>/', views.cancion, name='cancion'),
    path('login/user/', views.welcome, name='welcome'),
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('logout/', views.logout, name='logout'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

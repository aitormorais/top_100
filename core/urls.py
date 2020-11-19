from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('genero/', views.genero, name='genero'),
    path('genero/<str:nombre_genero>/', views.genero, name='genero'),
]

from django.shortcuts import render

# Create your views here.
from core.models import Cancion


def index(request):
    canciones = Cancion.objects.all()
    return render(request,"index.html",context={'canciones': canciones})

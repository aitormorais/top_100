from django.db.models import query
from django.http.response import HttpResponse
from django.shortcuts import render, get_object_or_404, get_list_or_404

# Create your views here.
from core.models import Cancion, Estilo, Artista


def index(request):
    canciones = Cancion.objects.all()
    return render(request, "index.html", context={'canciones': canciones})


def genero(request, nombre_genero=None):
    estilos = Estilo.objects.all()
    queryValida = False
    nameInput = False
    genero_seleccionado = None
    canciones_con_genero = None
    if(nombre_genero != None):
        nameInput = True
        try:
            genero_seleccionado = get_object_or_404(
                Estilo, nombre=nombre_genero)
            try:
                canciones_con_genero = get_list_or_404(
                    Cancion, estilo=genero_seleccionado)
                queryValida = True
            except Exception:
                pass
            pass
        except Exception:
            pass

    context = {
        "estilos": estilos,
        "nombre": nameInput,
        "query": queryValida,
        "genero": genero_seleccionado,
        "canciones": canciones_con_genero
    }
    return render(request, "genero.html", context)


def artista(request, nombre_artista=None):
    artista = Artista.objects.all()
    nombre_artista = None
    artista_seleccionado = None
    queryValida = False
    nameInput = False
    canciones_de_artista = None

    if(nombre_artista != None):
        nameInput = True
        try:
            artista_seleccionado = get_object_or_404(
                Artista, nombre=nombre_artista)
            try:
                canciones_de_artista = get_list_or_404(
                    Cancion, artista=artista_seleccionado)
                queryValida = True
            except Exception:
                pass
            pass
        except Exception:
            pass

    context = {
        "artist": artista,
        "nombre": nameInput,
        "query": queryValida,
        "artista": artista_seleccionado,
        "canciones_artista": canciones_de_artista
    }
    return render(request, "artista.html", context)


def cancionEscuchada(request):
    if request.method == "POST":
        print(request.body)
        return HttpResponse("Post OK")
    return HttpResponse(":(")

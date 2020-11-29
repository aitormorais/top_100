import json
from django.db.models import query
from django.http.response import HttpResponse
from django.shortcuts import render, get_object_or_404, get_list_or_404, redirect
from django.contrib.auth import login as do_login
from django.contrib.auth import logout as do_logout
from django.contrib.auth import authenticate
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm

# Create your views here.
from core.models import Cancion, Estilo, Artista


def index(request):
    generos = Estilo.objects.all()
    artistas = Artista.objects.all()
    canciones = []
    for e in generos:
        canciones.append(Cancion.objects.filter(
            estilo=e).order_by('-vecesEscuchada')[: 2])
    data = {
        'canciones': canciones,
        'generos': generos,
        'artistas': artistas
    }
    return render(request, "index.html", data)


def genero(request, nombre_genero=None):
    estilos = Estilo.objects.all()
    queryValida = False
    nameInput = False
    genero_seleccionado = None
    canciones_con_genero = None
    if (nombre_genero != None):
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
    artista_seleccionado = None
    queryValida = False
    nameInput = False
    canciones_de_artista = None

    if (nombre_artista != None):
        nameInput = True
        try:
            artista_seleccionado = get_object_or_404(
                Artista, nombre=nombre_artista)
            try:
                canciones_de_artista = get_list_or_404(
                    Cancion, artista=artista_seleccionado)
                queryValida = True
            except Exception as e:
                print(e)
                pass
            pass
        except Exception as e:
            print(e)
            pass

    context = {
        "artist": artista,
        "nombre": nameInput,
        "query": queryValida,
        "artista": artista_seleccionado,
        "canciones": canciones_de_artista
    }
    return render(request, "artista.html", context)


def cancion(request, nombre_cancion=None):
    canciones = Cancion.objects.all()
    queryValida = False
    cancion_seleccionado = None
    nombre = False
    if (nombre_cancion != None):
        nombre = True
        try:
            cancion_seleccionado = get_object_or_404(
                Cancion, nombre=nombre_cancion)
            queryValida = True
        except Exception:
            pass

    context = {
        "nombre": nombre,
        "canciones": canciones,
        "query": queryValida,
        "cancion": cancion_seleccionado,
    }
    return render(request, "cancion.html", context)


def cancionEscuchada(request):
    if request.method == "POST":
        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)
            content = body['cancion']
            cancion = get_object_or_404(Cancion, nombre=content)
            cancion.vecesEscuchada += 1
            data = {
                'status': 200,
                'data': 'OK',
                'Veces escuchada': cancion.vecesEscuchada
            }
            cancion.save()
            dump = json.dumps(data)
            return HttpResponse(dump, content_type='application/json')
        except Exception as e:
            data = {
                'status': 500,
                'data': e.__str__
            }
            dump = json.dumps(data)
            return HttpResponse(dump, content_type='application/json')

    return HttpResponse(":(")


def busqueda(request, nombre_cancion):
    query = False
    canciones = None
    try:
        # canciones = Cancion.objects.get(nombre__icontains=nombre_cancion).order_by('-vecesEscuchada')
        canciones = get_list_or_404(Cancion, nombre__icontains=nombre_cancion)
        query = True
    except Exception as e:
        print(e)
    data = {
        'query': query,
        'busqueda': nombre_cancion,
        'canciones': canciones
    }
    return render(request, "search.html", data)


def welcome(request):
    if request.user.is_authenticated:
        return render(request, "welcome.html")
    return redirect('/login')



def register(request):
    form = UserCreationForm()
    if request.method == 'POST':
        form = UserCreationForm(data=request.POST)
        if form.is_valid():
            user = form.save()
            if user is not None:
                do_login(request, user)
                return redirect('login/')

    return render(request, "register.html", {'form': form})


def login(request):
    form = AuthenticationForm()
    if request.method == "POST":
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']

            user = authenticate(username=username, password=password)

            if user is not None:
                do_login(request, user)

                return redirect('user/')

    return render(request, "login.html", {'form': form})


def logout(request):
    do_logout(request)
    return redirect('/')

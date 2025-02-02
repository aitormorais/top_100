from django.db import models
# Create your models here.


class Estilo(models.Model):
    nombre = models.CharField(primary_key=True, max_length=30)
    detalles = models.TextField()
    caratula = models.ImageField(upload_to='gallery')

    def get_nombre(self):
        return self.nombre

    def get_detalles(self):
        return self.detalles


class Artista(models.Model):
    nombre = models.CharField(primary_key=True, max_length=30)
    detalles = models.TextField()
    imagen = models.ImageField(upload_to='gallery')

    def get_nombre(self):
        return self.nombre

    def get_detalles(self):
        return self.detalles


class Cancion(models.Model):
    nombre = models.CharField(max_length=30)
    estilo = models.ForeignKey(Estilo, on_delete=models.CASCADE)
    artista = models.ForeignKey(Artista, on_delete=models.CASCADE)
    mp3 = models.FileField(upload_to='songs')
    caratula = models.ImageField(upload_to='gallery')
    vecesEscuchada = models.IntegerField(default=1)

    def get_nombre(self):
        return self.nombre

    def get_estilo(self):
        return self.estilo.get_nombre()

    def get_artista(self):
        return self.artista.get_nombre()

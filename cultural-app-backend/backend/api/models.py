from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    company = models.ForeignKey(
        "Company",
        on_delete=models.CASCADE,
        null=True,blank=True,
    )
    companyRole = models.CharField(
        max_length=255, 
        null=True, 
        blank=True
    )
    lastTimeNotifOpened = models.DateTimeField(
        null=True, 
        blank=True
    )
    longitude = models.DecimalField(
        max_digits=10,
        null=True , 
        decimal_places=5, 
        blank=True
    )
    latitude = models.DecimalField(
        max_digits=10,
        null=True, 
        decimal_places=5, 
        blank=True)
    followedCompanies = models.ManyToManyField(
        "Company", 
        related_name='followers', 
        blank=True
    )
    followedArtists = models.ManyToManyField(
        "Artist", 
        related_name="followers", 
        blank=True
    )
    followedEvents = models.ManyToManyField(
        "Event", 
        related_name="followers", 
        blank=True
    )
    tags = models.TextField(
        null=True, 
        blank=True
    )
    hasSpotify = models.BooleanField(default=False)

class Company(models.Model):
    name = models.CharField(
        max_length=255
    )
    address = models.CharField(
        max_length=255
    )
    nipNumber = models.CharField(
        max_length=10
    )
    regon = models.CharField(
        max_length=14
    )
    companyPhoto = models.ForeignKey(
        "Photo", 
        on_delete=models.SET_NULL, 
        null=True, blank=True
    )
    tags = models.TextField(
        null=True, 
        blank=True
    )
    created = models.DateTimeField(auto_now_add=True)


class Artist(models.Model):
    name = models.CharField(max_length=255)
    photoOfArtist = models.ForeignKey(
        "Photo", 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    addedBy = models.ForeignKey(
        Company, 
        on_delete=models.SET_NULL, 
        null=True
    )
    created = models.DateTimeField(auto_now_add=True)
    spotifyId = models.TextField(
        blank=True, 
        null=True
    )


class Event(models.Model):
    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE
    ) 
    name = models.CharField(max_length=255) 
    date = models.DateTimeField() 
    dateSecond = models.DateTimeField(
        null=True, 
        blank=True) 
    placeName = models.CharField(max_length=255) 
    placeStreet = models.CharField(max_length=255) 
    placeTown = models.CharField(max_length=255) 
    placeVoivod = models.CharField(max_length=255) 
    lowestPriceNorm = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True
    ) 
    highestPriceNorm = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True
    ) 
    isCon = models.BooleanField(default=False) 
    lowestPriceCon = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True
    ) 
    highestPriceCon = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True
    ) 
    description = models.TextField() 
    additionalInfo = models.TextField(
        null=True, 
        blank=True
    ) 
    artists = models.ManyToManyField(
        Artist, 
        related_name="events", 
        blank=True
    )
    isActive = models.BooleanField(default=True)
    everyoneCanEdit = models.BooleanField(default=False) 
    createdBy = models.ForeignKey(
        User, 
        on_delete=models.CASCADE
    ) 
    created = models.DateTimeField(auto_now_add=True) 
    soldOut = models.BooleanField(default=False)
    tags = models.TextField(
        null=True, 
        blank=True
    ) 
    link = models.CharField(
        max_length=255, 
        null=True, 
        blank=True
    )
    longitude = models.DecimalField(
        max_digits=10,
        null=True, 
        decimal_places=5, 
        blank=True
    )
    latitude = models.DecimalField(
        max_digits=10,
        null=True, 
        decimal_places=5, 
        blank=True
    )
    numberOfFollowers = models.IntegerField(default=0)

class Photo(models.Model):
    image = models.ImageField(upload_to="uploads/")
    companyImage = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    eventImage = models.ForeignKey(
        Event, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    artistImage = models.ForeignKey(
        Artist, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
class Notification(models.Model):
    event = models.ForeignKey(
        Event, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    artist = models.ForeignKey(
        Artist, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    notificationDescription = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
class SpotifyToken(models.Model):
    user = models.OneToOneField(
        User,on_delete=models.CASCADE,
        related_name="spotify_token"
    )
    access_token = models.TextField()
    refresh_token = models.TextField()
    expires_in = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)


    
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
from .models import Company
from .serializers import CompanySerializer
from .models import Event
from .serializers import EventSerializer
from .models import Artist
from .serializers import ArtistSerializer
from .models import Notification
from .serializers import NotificationSerializer
from .models import Photo
from .serializers import PhotoSerializer
from .serializers import RegisterSerializer
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import make_password
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from geopy.geocoders import Nominatim
from django.conf import settings
from urllib.parse import urlencode
import requests
from django.shortcuts import redirect
from .models import SpotifyToken
from django.core.files.base import ContentFile
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
# Create your views here.
geolocator = Nominatim(user_agent="cultural_events_app")

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data.copy()
    try: 
        emailExists = User.objects.get(email = data.get("email"))
        return Response({"error": "Użytkownik z podanym e-mailem już istnieje"}, status=400)
    except User.DoesNotExist:
        pass
    username = data.get("username")
    counter = 1
    while User.objects.filter(username=username).exists():
        username=f"{username}{counter}"
        counter+=1
    data["username"] = username
    password = data.get("password")
    data["password"] = make_password(password)
    serializer = RegisterSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "user created succesfully", "user_id": user.id}, status=201)
    return Response(serializer.errors, status=400)
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    login = request.data.get("login")
    password = request.data.get("password")
    user = None
    if not login or not password:
        return Response({"error": "Pola email i hasło są wymagane"}, status=400)
    if "@" in login:
        try:
            user = User.objects.get(email = login)
        except User.DoesNotExist:
            return Response({"error": "email nie istnieje"}, status=400)
        if not user.check_password(password):
            return Response({"error": "złe hasło"}, status=400)
        if not user.is_active:
            return Response({"error": "konto zostało dezaktywowane"}, status=400)
    refresh = RefreshToken.for_user(user)
    response = Response({
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "company_id": user.company_id,
            "companyRole": user.companyRole,
            "date_joined": user.date_joined,
            "lastTimeNotifOpened": user.lastTimeNotifOpened,
            "is_active": user.is_active,
            "longitude": user.longitude,
            "latitude": user.latitude,
            "followedArtists": list(user.followedArtists.values_list("id", flat=True)),
            "followedCompanies": list(user.followedCompanies.values_list("id", flat=True)),
            "followedEvents": list(user.followedEvents.values_list("id", flat=True)),
            "tags" : user.tags,
            "hasSpotify": user.hasSpotify
        },
    }, status=200)
    response.set_cookie(
        key="access_token",
        value=str(refresh.access_token),
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        max_age=60 * 30, 
    )
    response.set_cookie(
        key="refresh_token",
        value=str(refresh),
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        max_age=60 * 60 * 24 * 7,
    )
    return response
@api_view(['POST'])
@permission_classes([AllowAny])
def create_company(request):
    data = request.data.copy()
    try: 
        nipExists = Company.objects.get(nipNumber = data.get("nipNumber"))
        return Response({"error": "Firma z podanym nipem już jest zarejestrowana"}, status=400)
    except Company.DoesNotExist:
        pass
    try: 
        regonExists = Company.objects.get(regon = data.get("regon"))
        return Response({"error": "Firma z podanym regonem już jest zarejestrowana"}, status=400)
    except Company.DoesNotExist:
        pass
    companySerializer = CompanySerializer(data = data)
    if companySerializer.is_valid():
        company = companySerializer.save()
        user = User.objects.get(id = data.get("companyOwner"))
        user.company = company
        user.save()
        return Response(
            {"message": "Firma została pomyślnie utworzona"},
            status=201
        )
    return Response(companySerializer.errors, status=400)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_company(request, pk):
    company = get_object_or_404(Company, id=pk)
    return Response(CompanySerializer(company).data, status=200) 
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_company(request):
    user = request.user
    if not user.company:
        return Response(serializer.errors, status=400)
    company = Company.objects.get(id=user.company.id)
    if user.company != company or user.companyRole != "Owner":
        return Response(serializer.errors, status=400)
    serializer = CompanySerializer(company ,data = request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message":"edytowano pomyślnie"}, status=200)
    return Response(serializer.errors, status=400)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_photo(request):
    serializer = PhotoSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_photos(request):
    photos = Photo.objects.all()
    return Response(PhotoSerializer(photos, many=True).data)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_event(request):
    user = request.user
    if not user.company:
        return Response({"error": "Nie masz uprawnień"}, status=400)
    data = request.data.copy()
    data["company"] = user.company.id
    data["createdBy"] = user.id
    serializer = EventSerializer(data = data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_artist(request):
    serializer = ArtistSerializer(data = {"name": request.data.get("name"), "createdBy": request.data.get("createdBy")})
    if serializer.is_valid():
        newArtist = serializer.save()
        photoSerializer = PhotoSerializer(data = {"artistImage": newArtist.id, "image":request.data.get("photoFile")})
        if photoSerializer.is_valid():
            newPhoto = photoSerializer.save()
            artistEditSerializer = ArtistSerializer(newArtist, data = {"photoOfArtist" : newPhoto.id}, partial=True)
            if artistEditSerializer.is_valid():
                artistEditSerializer.save()
                return Response(serializer.data, status=200)
            return Response(artistEditSerializer.errors, status=400)
        return Response(photoSerializer.errors, status=400)
    return Response(serializer.errors, status=400)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_notification(request):
    serializer = NotificationSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_event_artist(request, pk):
    event = Event.objects.get(id=pk)
    artist = Artist.objects.get(id=request.data.get("artist"))
    event.artists.add(artist)
    return Response({"status": "artist added"}, status=200)
##################################################################
@api_view(['GET'])
@permission_classes([AllowAny])
def get_events(request):
    events = Event.objects.all()
    return Response(EventSerializer(events, many=True).data)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_artists(request):
    artists = Artist.objects.all()
    return Response(ArtistSerializer(artists, many=True).data)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_companies(request):
    companies = Company.objects.all()
    return Response(CompanySerializer(companies, many=True).data)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_notifications(request):
    notifications = Notification.objects.all()
    return Response(NotificationSerializer(notifications, many=True).data)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_event_artists(request, pk):
    event = Event.objects.get(id=pk)
    artists = event.artists.all()
    serializer = ArtistSerializer(artists, many=True)
    return Response(serializer.data, status=200)
@api_view(['GET'])
def get_coordinates(request):
    town = request.query_params.get("town")
    voivod = request.query_params.get("voivod")
    location = geolocator.geocode(f"{town}, województwo {voivod}, Poland")
    if location:
        return JsonResponse({
            "lat": location.latitude,
            "lon": location.longitude
        })
    else:
        return JsonResponse({"error": "Nie znaleziono miejscowości"}, status=404)
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def patch_event(request, pk):
    user = request.user
    event = Event.objects.get(id=pk)
    if not user.company or user.company.id != event.company.id or (user.id != event.createdBy.id and not event.everyoneCanEdit):
        return Response({"error": "Nie posiadasz uprawnień"}, status=400)
    serializer = EventSerializer(event ,data = request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message":"edytowano pomyślnie"}, status=200)
    return Response(serializer.errors, status=400)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_event(request, pk):
    user = request.user
    event = Event.objects.get(id=pk)
    if not user.company or user.company.id != event.company.id or (user.id != event.createdBy.id and not event.everyoneCanEdit) or (user.companyRole != "Owner" and user.companyRole != "Admin"):
        return Response({"error": "Nie posiadasz uprawnień"}, status=400)
    event.delete()
    return Response("event deleted")
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_event(request, pk):
    user = request.user
    event = Event.objects.get(id=pk)
    if not user.company or user.company.id != event.company.id or (user.id != event.createdBy.id and not event.everyoneCanEdit):
        return Response({"error": "Nie posiadasz uprawnień"}, status=400)
    serializer = EventSerializer(event ,data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_event_artists(request, pk):
    event = Event.objects.get(id=pk)
    event.artists.clear()
    return Response({"Message": "Wyczysczono dane"}, status=200)
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_photo(request, pk):
    photo = get_object_or_404(Photo, id=pk)
    serializer = PhotoSerializer(photo, data = request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message":"Zmieniono zdjęcie pomyślnie"}, status=200)
    return Response(serializer.errors, status=400)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_employees(request):
    user = request.user
    if not user.company:
        return Response({"error": "Nie masz uprawnień do wykonania polecenia"}, status=400)
    employees = User.objects.filter(company=user.company)
    return Response(UserSerializer(employees, many=True).data, status=200)
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_employee(request, pk):
    user = request.user
    employee = User.objects.get(id=pk)
    if not user.company or user.company.id != employee.company.id or user.companyRole != "Owner":
        return Response({"error": "Nie masz uprawnień do wykonania polecenia"}, status=400)
    serializer = UserSerializer(employee ,data = request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message":"edytowano pomyślnie"}, status=200)
    return Response(serializer.errors, status=400)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_event(request, pk):
    user = request.user
    event = Event.objects.get(id=pk)
    user.followedEvents.add(event)
    serializer = EventSerializer(event,data = {"numberOfFollowers": request.data.get("numberOfFollowers")} ,partial=True)
    if serializer.is_valid():
            serializer.save()
            return Response({"message":"Wydarzenie zostało zaobserwowane"}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_artist(request, pk):
    user = request.user
    artist = Artist.objects.get(id=pk)
    user.followedArtists.add(artist)
    return Response({"message":"Artysta został zaobserwowany"}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_company(request, pk):
    user = request.user
    company = Company.objects.get(id=pk)
    user.followedCompanies.add(company)
    return Response({"message":"Organizacja została zaobserwowane"}, status=200)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unfollow_event(request, pk):
    user = request.user
    event = Event.objects.get(id=pk)
    user.followedEvents.remove(event)
    serializer = EventSerializer(event,data = {"numberOfFollowers": request.data.get("numberOfFollowers")} ,partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message":"Nieobserwujesz już wydarzenia"}, status=200)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unfollow_artist(request, pk):
    user = request.user
    artist = Artist.objects.get(id=pk)
    user.followedArtists.remove(artist)
    return Response({"message":"Nieobserwujesz już artysty"}, status=200)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unfollow_company(request, pk):
    user = request.user
    event = Company.objects.get(id=pk)
    user.followedCompanies.remove(event)
    return Response({"message":"Nieobserwujesz już organizacji"}, status=200)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def spotify_login(request):
    scopes = "user-top-read"
    user = request.user
    user_id = user.id
    params = urlencode({
        "client_id": settings.SPOTIFY_CLIENT_ID,
        "response_type": "code",
        "redirect_uri": settings.SPOTIFY_REDIRECT_URI,
        "scope": scopes,
        "state": user_id
    })
    auth_url=f"https://accounts.spotify.com/authorize?{params}"
    return JsonResponse({"url":auth_url})
def spotify_callback(request):
    code = request.GET.get("code")
    user_id = request.GET.get("state")
    response = requests.post(
        "https://accounts.spotify.com/api/token",
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": settings.SPOTIFY_REDIRECT_URI,
            "client_id": settings.SPOTIFY_CLIENT_ID,
            "client_secret": settings.SPOTIFY_CLIENT_SECRET,
        },
    )
    data = response.json()
    access_token = data.get("access_token")
    refresh_token = data.get("refresh_token")
    expires_in = data.get("expires_in")
    user = User.objects.get(id=user_id)
    SpotifyToken.objects.update_or_create(
        user=user,
        defaults={
            "access_token": settings.FERNET.encrypt(access_token.encode()).decode(),
            "refresh_token": settings.FERNET.encrypt(refresh_token.encode()).decode(),
            "expires_in": expires_in
        }
    )
    userEditSerializer = UserSerializer(user,data={"hasSpotify": True},partial=True)
    if userEditSerializer.is_valid():
        userEditSerializer.save()
    return redirect("http://localhost:5173/#/logout")
def refresh_spotify_token(spotify):
    response = requests.post(
        "https://accounts.spotify.com/api/token",
        data={
            "grant_type": "refresh_token",
            "refresh_token": settings.FERNET.decrypt(
                spotify.refresh_token.encode()
            ).decode(),

            "client_id": settings.SPOTIFY_CLIENT_ID,
            "client_secret": settings.SPOTIFY_CLIENT_SECRET,
        },
    )
    data = response.json()
    access_token = data.get("access_token")
    spotify.access_token = settings.FERNET.encrypt(access_token.encode()).decode()
    spotify.expires_in = data.get("expires_in")
    spotify.save()
    return spotify
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_top_artists(request):

    spotify = SpotifyToken.objects.get(user=request.user)
    access_token = settings.FERNET.decrypt(spotify.access_token.encode()).decode()
    response = requests.get(
        "https://api.spotify.com/v1/me/top/artists",
        headers={
            "Authorization": f"Bearer {access_token}"
        },
        params={
            "limit": 10,
            "time_range": "long_term"
        }
    )
    if response.status_code == 401:
        spotify = refresh_spotify_token(spotify)
        access_token = settings.FERNET.decrypt(spotify.access_token.encode()).decode()
        response = requests.get(
            "https://api.spotify.com/v1/me/top/artists",
            headers={
                "Authorization": f"Bearer {access_token}"
            },
            params={
                "limit": 10,
                "time_range": "long_term"
            }
        )
    return JsonResponse(response.json())
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_spotify_artist(request):
    photoResponse = requests.get(request.data.get("photoUrl"))
    if photoResponse.status_code != 200 and photoResponse.status_code != 201:
        print("Didnt manage to install the photo")
        return
    serializer = ArtistSerializer(data = {"name": request.data.get("name"), "spotifyId": request.data.get("spotifyId")})
    if serializer.is_valid():
        newArtist = serializer.save()
        photoSerializer = PhotoSerializer(data = {"artistImage": newArtist.id, "image":ContentFile(photoResponse.content, name=f"spotify_artist{newArtist.name}.jpg")})
        if photoSerializer.is_valid():
            newPhoto = photoSerializer.save()
            artistEditSerializer = ArtistSerializer(newArtist, data = {"photoOfArtist" : newPhoto.id}, partial=True)
            if artistEditSerializer.is_valid():
                artistEditSerializer.save()
                return Response(serializer.data, status=200)
            return Response(artistEditSerializer.errors, status=400)
        return Response(photoSerializer.errors, status=400)
    return Response(serializer.errors, status=400)
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user(request):
    user = request.user
    serializer = UserSerializer(user ,data = request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message":"edytowano pomyślnie"}, status=200)
    return Response(serializer.errors, status=400)
@api_view(["POST"])
def logout_view(request):
    response = Response({"detail": "Wylogowano"}, status=200)
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return response
@api_view(["POST"])
def refresh_token(request):
    refresh_token = request.COOKIES.get("refresh_token")
    if not refresh_token:
        return Response({"error": "Brak refresh tokena"}, status=401)
    try:
        refresh = RefreshToken(refresh_token)
        new_access = str(refresh.access_token)
    except TokenError:
        response = Response({"error": "Nieprawidłowy token"}, status=401)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response
    response = Response({"detail": "Token odświeżony"}, status=200)
    response.set_cookie(
        key="access_token",
        value=new_access,
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        max_age=60 * 30,
    )
    return response
@api_view(["GET"])
@permission_classes([AllowAny])
def verify_token(request):
    access_token = request.COOKIES.get("access_token")
    refresh_token = request.COOKIES.get("refresh_token")
    if not access_token and not refresh_token:
        return Response({"isAccessValid": False, "isRefreshValid": False}, status=200)
    if access_token:
        try:
            AccessToken(access_token)
            return Response({"isAccessValid": True}, status=200)
        except TokenError:
            pass  
    if refresh_token:
        try:
            RefreshToken(refresh_token) 
            return Response({"isAccessValid": False, "isRefreshValid": True}, status=200)
        except TokenError:
            return Response({"isAccessValid": False, "isRefreshValid": False}, status=200)

    return Response({"isAccessValid": False, "isRefreshValid": False}, status=200)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_employee(request):
    user = request.user
    if not user.company:
        return Response({"error": "Nie jesteś uprawniony"}, status=400)
    company = Company.objects.get(id=user.company.id)
    if user.company != company or user.companyRole != "Owner":
        return Response({"error": "Nie jesteś uprawniony"}, status=400)
    data = request.data.copy()
    try: 
        emailExists = User.objects.get(email = data.get("email"))
        return Response({"error": "Użytkownik z podanym e-mailem już istnieje"}, status=400)
    except User.DoesNotExist:
        pass
    username = data.get("username")
    counter = 1
    while User.objects.filter(username=username).exists():
        username=f"{username}{counter}"
        counter+=1
    data["username"] = username
    password = data.get("password")
    data["password"] = make_password(password)
    data["company"] = company.id
    serializer = RegisterSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "user created succesfully", "user_id": user.id}, status=201)
    return Response(serializer.errors, status=400)
    

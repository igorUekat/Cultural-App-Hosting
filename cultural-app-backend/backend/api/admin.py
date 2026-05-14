from django.contrib import admin
from .models import User
from .models import Event
from .models import Artist
from .models import Notification
from .models import Photo
from .models import Company
from .models import SpotifyToken
# Register your models here.
admin.site.register(User)
admin.site.register(Event)
admin.site.register(Artist)
admin.site.register(Notification)
admin.site.register(Photo)
admin.site.register(Company)
@admin.register(SpotifyToken)
class SpotifyTokenAdmin(admin.ModelAdmin):
    exclude = (
        "access_token",
        "refresh_token",
    )
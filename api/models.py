from django.db import models
from django.conf import settings

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    name = models.CharField(max_length=120, blank=True, default="")
    allergens = models.JSONField(default=list, blank=True)
    #custom = models.JSONField(default=list, blank=True)



    def __str__(self):
        return f"Profile({self.user.username})"
    

class item(models.Model):
    gtin = models.CharField(max_length=14, unique=True)
    ingredients = models.JSONField(default=list, blank=True)
    last_source = models.CharField(max_length=16, default="ocr")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [models.Index(fields=["gtin"])]
    def __str__(self):
        return self.gtin

class ScanResult(models.Model):
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="scans")
    gtin       = models.CharField(max_length=32)
    raw_text   = models.TextField(blank=True, default="")
    tokens     = models.JSONField(default=list)           
    matches    = models.JSONField(default=list)           
    unknown    = models.JSONField(default=list)
    flagged    = models.JSONField(default=list)
    is_safe    = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta: 
        indexes = [models.Index(fields=['gtin','created_at'])]
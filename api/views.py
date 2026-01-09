from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RegisterSerializer, ProfileSerializer
from .models import UserProfile, item, ScanResult
from rest_framework.parsers import MultiPartParser, FormParser
from pathlib import Path
from ScanSafe.DB.ocrChild import ProcessFile
#from ScanSafe.DB.barcode import GetGtin
from ScanSafe.DB.checker import Checker  
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.permissions import AllowAny
from django.contrib.auth import login
from rest_framework import status
from django.utils.decorators import method_decorator
from django.db import IntegrityError
import tempfile


from rest_framework.authentication import SessionAuthentication


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"csrfToken": get_token(request)})
    
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = serializer.save()
        except IntegrityError:
            return Response(
                {"error": "Account already exists. Try logging in."},
                status=status.HTTP_409_CONFLICT,
            )

        login(request, user)
        return Response(
            {"user": {"email": user.email, "name": user.first_name}},
            status=status.HTTP_201_CREATED
        )

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()
        password = request.data.get("password") or ""

        user = authenticate(request, username=email, password=password)
        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        login(request, user)
        return Response({"user": {"email": user.email, "name": user.first_name}})
    
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"})



class MeView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"user": None})
        u = request.user
        return Response({"user": {"email": u.email, "name": u.first_name}})


class ProfileView(APIView):
    def get(self, request):   
        if not request.user.is_authenticated:
            return Response({"detail": "Auth required"}, status=status.HTTP_401_UNAUTHORIZED)
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        data = ProfileSerializer(profile).data
        return Response(data)
    def patch(self, request):
        if not request.user.is_authenticated:
            return Response({"detail": "Auth required"}, status=status.HTTP_401_UNAUTHORIZED)
        profile, _ = UserProfile.objects.get_or_create(user=request.user)

        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        if not request.user.is_authenticated:
            return Response({"detail": "Auth required"}, status=status.HTTP_401_UNAUTHORIZED)
        profile, _ = UserProfile.objects.get_or_create(user=request.user)

        serializer = ProfileSerializer(profile, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
class ScanView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        gtin = (request.data.get("gtin") or "").strip()
        file = request.FILES.get("image")

        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        user_allergens = profile.allergens or []

        if file is not None:
            if not gtin:
                return Response(
                    {"detail": "Missing gtin for ingredients upload."},
                    status=status.HTTP_400_BAD_REQUEST,)

            suffix = Path(file.name).suffix or ".jpg"
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                for chunk in file.chunks():
                    tmp.write(chunk)
                image_path = tmp.name

            FileResults = ProcessFile(image_path)

            raw_text = FileResults.get("raw_text", "")
            tokens = FileResults.get("tokens", [])
            canonical_items = FileResults.get("VerifiedIngredients", [])
            unknown = FileResults.get("unknown", [])
            matches = [(c, c, 100) for c in canonical_items]

            flagged = Checker(user_allergens, canonical_items)
            is_safe = (len(flagged) == 0)

            item.objects.update_or_create(
                gtin=gtin,
                defaults={"ingredients": canonical_items, "last_source": "ocr"},)

            ScanResult.objects.create(
                user=request.user, gtin=gtin, raw_text=raw_text, tokens=tokens, matches=matches,
                unknown=unknown,flagged=flagged,is_safe=is_safe,)

            return Response({
                    "gtin": gtin,
                    "gtin_source": "ingredients",
                    "raw_text": raw_text,
                    "tokens": tokens,
                    "matches": matches,
                    "unknown": unknown,
                    "flagged": flagged,
                    "is_safe": is_safe,
                    "cache": "ocr",
                },status=status.HTTP_200_OK,)

        if not gtin:
            return Response({"detail": "Missing gtin"}, status=status.HTTP_400_BAD_REQUEST)

        cached = item.objects.filter(gtin=gtin).first()
        if cached and cached.ingredients:
            canonical_items = cached.ingredients
            matches = [(c, c, 100) for c in canonical_items]

            flagged = Checker(user_allergens, canonical_items)
            is_safe = (len(flagged) == 0)

            last = (
                ScanResult.objects.filter(gtin=gtin).order_by("-created_at").first())

            raw_text = last.raw_text if last else ""
            tokens = last.tokens if last else []
            unknown = last.unknown if last else []

            ScanResult.objects.create(
                user=request.user,
                gtin=gtin, raw_text=raw_text,
                tokens=tokens,matches=matches,
                unknown=unknown,flagged=flagged,is_safe=is_safe,
            )

            return Response(
                {
                    "gtin": gtin,
                    "gtin_source": "frontend_barcode",
                    "raw_text": raw_text,
                    "tokens": tokens,
                    "matches": matches,
                    "unknown": unknown,
                    "flagged": flagged,
                    "is_safe": is_safe,
                    "cache": "hit",
                },
                status=status.HTTP_200_OK,
            )

        # cache miss -> prompt ingredients photo
        return Response(
            {
                "gtin": gtin,
                "gtin_source": "frontend_barcode",
                "cache": "miss",
                "next": "ingredients_photo",
                "detail": "Product not in Database yet. Upload a picture of ingredients.",
            },
            status=status.HTTP_200_OK,
        )



class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        current = request.data.get("currentPassword") or ""
        new = request.data.get("newPassword") or ""

        if not request.user.check_password(current):
            return Response({"error": "Current password is incorrect"}, status=400)

        try:
            validate_password(new, user=request.user)
        except ValidationError as e:
            return Response({"error": e.messages}, status=400)

        request.user.set_password(new)
        request.user.save()
        login(request, request.user)  # keep them logged in after change
        return Response({"message": "Password updated"})
    
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.core.paginator import Paginator
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from .models import User, Like, Post, Comment

def login_required_json(view_func):
    """Decorator for JSON endpoints that returns 401 if not logged in"""
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapper

def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@require_POST
@login_required_json
def api_create_post(request):
    if request.method != 'POST':
        return JsonResponse({'error':'POST request required.'}, status=400)

    data = request.POST.get("description") or request.body

    import json
    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error":"Invalid JSON"}, status=400)
    
    description = data.get("description", "").strip()
    if description == "":
        return JsonResponse({"error": "Description cannot be empty"}, status=400)
    
    post = Post.objects.create(
        user=request.user,
        description=description
    )
    return JsonResponse({
        "message": "Post created successfully",
        "post": {
            "id": post.id,
            "user": {"username": post.user.username},
            "description": post.description,
            "likes_count": 0,
            "liked": False,
            "timestamp": post.timestamp.strftime("%Y-%m-%d %H:%M:%S"),

        }
    }, status=201)

@login_required_json
def all_posts(request, user_id=None):
    if user_id:
        profile_user = get_object_or_404(User, pk=user_id)
    else:
        profile_user = request.user
    return render(request, "network/all_posts.html", {
        "profile_user": profile_user
    })

@login_required
def like_post(request, post_id):
    post = get_object_or_404(Post, pk=post_id)

    like, created = Like.objects.get_or_create(user=request.user, post=post)

    if not created:
        like.delete()
        liked = False
    else:
        liked = True
    likes_count = post.likes.count()

    return JsonResponse({
        "liked": liked,
        "likes_count": likes_count
    })

@login_required
@require_POST
def follow_user(request, user_id):
    target_user = get_object_or_404(User, pk=user_id)
    current_user = request.user

    if current_user == target_user:
        return JsonResponse({"error": "You cannot follow yourself."}, status=400)  # fixed

    if current_user in target_user.followers.all():
        target_user.followers.remove(current_user)
        followed = False
    else:
        target_user.followers.add(current_user)
        followed = True
    
    followers_count = target_user.followers.count()
    following_count = target_user.following.count()

    return JsonResponse({
        "followed": followed,
        "followers_count": followers_count,
        "following_count": following_count
    })

@login_required
def api_user_followers(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    followers = [{"id": u.id, "username": u.username} for u in user.followers.all()]
    following = [{"id": u.id, "username": u.username} for u in user.following.all()]

    return JsonResponse({
        "followers": followers,
        "following": following
    })

def serialize_posts(posts_queryset, request, per_page=5):
    paginator = Paginator(posts_queryset, per_page)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    posts_data = [
        {
            "id": p.id,
            "user": {
                "id": p.user.id,
                "username": p.user.username
            },
            "description": p.description,
            "likes_count": p.likes.count(),
            "liked": request.user.is_authenticated and p.likes.filter(user=request.user).exists(),
            "timestamp": p.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        }
        for p in page_obj
    ]

    return JsonResponse({
        "posts": posts_data,
        "page": page_obj.number,
        "total_pages": paginator.num_pages,
        "has_next": page_obj.has_next(),
        "has_previous": page_obj.has_previous(),
        "next_page": page_obj.next_page_number() if page_obj.has_next() else None,
        "previous_page": page_obj.previous_page_number() if page_obj.has_previous() else None
    })

def api_posts(request):
    posts = Post.objects.all().order_by('-timestamp')
    return serialize_posts(posts, request)

@login_required_json
def api_user_posts(request, user_id=None):
    if user_id:
        user = get_object_or_404(User, pk=user_id)
    else:
        user = request.user
    
    posts = Post.objects.filter(user=user).order_by('-timestamp')
    return serialize_posts(posts, request)
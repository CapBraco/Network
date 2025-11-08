
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("post/all_posts/", views.all_posts, name='all_posts'),
    path("post/all_posts/<int:user_id>/", views.all_posts, name='all_posts_user'),
    path("api/posts/", views.api_posts, name='api_posts'),
    path("like/<int:post_id>/", views.like_post, name='like_post'),
    path("following/", views.following_page, name='following_page'),
    path("api/posts/user/", views.api_user_posts, name="api_user_posts"),
    path("api/posts/user/<int:user_id>/", views.api_user_posts, name='api_user_posts_id'),
    path("api/create_post/", views.api_create_post, name='api_create_post'),
    path("api/user_followers/<int:user_id>/", views.api_user_followers, name='user_followers'),
    path("api/posts/following/", views.api_user_following, name="api_user_following"),
    path("post/follow_user/<int:user_id>/", views.follow_user, name='follow_user'),
    path("edit_post/<int:post_id>/", views.edit_post, name='edit_post')
]

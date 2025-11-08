from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    followers = models.ManyToManyField('self', symmetrical=False, related_name='following', blank=True)

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    description = models.TextField(max_length=600)
    timestamp = models.DateTimeField(auto_now_add=True)

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    class Meta:
        unique_together = ('user', 'post')
    def __str__(self):
        return f"{self.user.username} liked {self.post.id}"

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    description = models.TextField(max_length=200)
    timestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.user.username} commented: {self.description[:30]}"
    
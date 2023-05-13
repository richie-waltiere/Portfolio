from django.urls import path, reverse
from . import views

urlpatterns = [
        path('', views.mathematics, name='mathematics'),
        path('archimedes-approximation/', views.archimedes, name='archimedes-approximation'),
        path('combinatorics/', views.combinatorics, name='combinatorics'),
        path('combinatorics/poker-hands/', views.poker_hands, name='poker-hands'),
]

from django.urls import include, path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('additional_info/', views.additional_info, name='additional_info'),
    path('mathematics/', include('mathematics.urls')),
] 

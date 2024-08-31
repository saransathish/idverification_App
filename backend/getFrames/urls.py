from django.urls import path # type: ignore
from . import views

urlpatterns = [
    path('',views.index,name='index'),
    path('upload/',views.uploadImage,name='upload'),
    path('clicked/',views.clicked,name='clicked'),
    
]

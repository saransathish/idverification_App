import os
from django.shortcuts import render
from django.http import HttpResponse , JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return HttpResponse("helloworld!")

@csrf_exempt
def uploadImage(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image = request.FILES['image']
        print('hello')
        image_path = os.path.join('./getframes/media/Frames', image.name)
        with open(image_path, 'wb+') as destination:
            for chunk in image.chunks():
                destination.write(chunk)
        
        return JsonResponse({'message': 'Image uploaded successfully!'}, status=200)
    else:
        return JsonResponse({'error': 'No image found in request'}, status=400)

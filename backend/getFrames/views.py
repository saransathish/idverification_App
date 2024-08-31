from datetime import datetime
import os
from django.shortcuts import render # type: ignore
from django.http import HttpResponse , JsonResponse # type: ignore
from django.views.decorators.csrf import csrf_exempt # type: ignore
from django.views.decorators.csrf import csrf_exempt # type: ignore

def index(request):
    return HttpResponse("helloworld!")

@csrf_exempt
def uploadImage(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image = request.FILES['image']

        # Generate a unique filename using the current timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        image_extension = os.path.splitext(image.name)[1]  # Get the original file extension
        new_image_name = f'image_{timestamp}{image_extension}'

        # Save the image with the new filename
        image_path = os.path.join('./getframes/media/Frames', new_image_name)
        with open(image_path, 'wb+') as destination:
            for chunk in image.chunks():
                destination.write(chunk)

        return JsonResponse({'message': 'Image uploaded successfully!', 'filename': new_image_name}, status=200)
    else:
        return JsonResponse({'error': 'No image found in request'}, status=400)

@csrf_exempt
def clicked(request):
    print('hitting')
    return JsonResponse({'message': ' successfull!'}, status=200)

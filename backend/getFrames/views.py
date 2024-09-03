from datetime import datetime
import os
from django.shortcuts import render # type: ignore
from django.http import HttpResponse , JsonResponse # type: ignore
from django.views.decorators.csrf import csrf_exempt # type: ignore
from deepface import DeepFace # type: ignore
import cv2 # type: ignore

class Model_Initialization():
    def __init__(self):
        self.model = DeepFace.build_model("Facenet")
        print('model loaded')
obj = Model_Initialization()

def index(request):
    return HttpResponse("helloworld!")


@csrf_exempt
def clicked(request):
    print('hitting')
    return JsonResponse({'message': ' successfull!'}, status=200)



@csrf_exempt
def verify_faces_in_single_image(image_path): 
    # Choose a model (e.g., 'Facenet', 'VGG-Face', etc.)
    try:
        detections = DeepFace.extract_faces(img_path=image_path, enforce_detection=True) 
        # Pass the loaded model to extract_faces
    except ValueError as e:
        # print("No faces detected in the image.")
        return False, 0

    num_faces = len(detections)

    if num_faces != 2:
        print(f"Expected two faces, but found {num_faces}.")
        return False, num_faces

    face1 = detections[0]['face']
    face2 = detections[1]['face']

    result = DeepFace.verify(img1_path=face1, img2_path=face2, enforce_detection=False) 
    # Pass the loaded model to verify
    return result['verified'], num_faces

@csrf_exempt
def uploadImage(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image = request.FILES['image']

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        image_extension = os.path.splitext(image.name)[1]  # Get the original file extension
        new_image_name = f'image_{timestamp}{image_extension}'

        image_path = os.path.join('./getframes/media/Frames', new_image_name)
        # with open(image_path, 'wb+') as destination:
        #     for chunk in image.chunks():
        #         destination.write(chunk)
        
        is_match, num_faces = verify_faces_in_single_image(image_path) 
        if is_match:

            print("Faces match!")
            return JsonResponse({'message': f'YES'}, status=200)
            
        else:
            print("Faces do not match.")
            return JsonResponse({'message': f'Faces do not match! hold the phone stable '}, status=200)
            return JsonResponse({'message': 'YES'}, status=200)

        print(f"Number of faces detected: {num_faces}")

        return JsonResponse({'message': f'Number of faces detected! {num_faces}'}, status=200)
    else:
        return JsonResponse({'error': 'No image found in request'}, status=400)

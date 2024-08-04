from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def user_registration(request):
    return Response({'message':'user registration is succesfull'},200)

@api_view(['POST'])
def user_login(request):
    return Response({'message':'login succesfull'},200)
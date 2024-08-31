from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Product,Category,MadeOf,Country,Brand
from .serializers import ProductSerializer,CategorySerializer,MadeOfSerializer,CountrySerializer,BrandSerializer


# product function based views

@api_view(['GET'])
def product_list(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def product_create(request):
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = ProductSerializer(product)
    return Response(serializer.data)

@api_view(['PUT'])
def product_update(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = ProductSerializer(product, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def product_delete(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    product.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# category function based views

@api_view(['GET'])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def category_create(request):
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def category_detail(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = CategorySerializer(category)
    return Response(serializer.data)

@api_view(['PUT'])
def category_update(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = CategorySerializer(category, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def category_delete(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    category.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# madeOf function based views

@api_view(['GET', 'POST'])
def madeof_list(request):
    if request.method == 'GET':
        madeofs = MadeOf.objects.all()
        serializer = MadeOfSerializer(madeofs, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = MadeOfSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def madeof_create(request):
    serializer = MadeOfSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def madeof_detail(request, madeof_id):
    try:
        madeof = MadeOf.objects.get(pk=madeof_id)
    except MadeOf.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = MadeOfSerializer(madeof)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = MadeOfSerializer(madeof, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        madeof.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['PUT'])
def madeof_update(request, madeof_id):
    try:
        madeof = MadeOf.objects.get(pk=madeof_id)
    except MadeOf.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = MadeOfSerializer(madeof, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def madeof_delete(request, madeof_id):
    try:
        madeof = MadeOf.objects.get(pk=madeof_id)
    except MadeOf.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    madeof.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# country function based views
    
@api_view(['GET', 'POST'])
def country_list(request):
    if request.method == 'GET':
        countries = Country.objects.all()
        serializer = CountrySerializer(countries, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CountrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def country_create(request):
    if request.method == 'POST':
        serializer = CountrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET', 'PUT', 'DELETE'])
def country_detail(request, country_id):
    try:
        country = Country.objects.get(pk=country_id)
    except Country.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CountrySerializer(country)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CountrySerializer(country, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        country.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)    
    

@api_view(['PUT'])
def country_update(request, pk):
    try:
        country = Country.objects.get(pk=pk)
    except Country.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = CountrySerializer(country, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def country_delete(request, pk):
    try:
        country = Country.objects.get(pk=pk)
    except Country.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    country.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# Brands function based views   


@api_view(['GET', 'POST'])
def brand_list(request):
    if request.method == 'GET':
        brands = Brand.objects.all()
        serializer = BrandSerializer(brands, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = BrandSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def brand_create(request):
    if request.method == 'POST':
        serializer = BrandSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET', 'PUT', 'DELETE'])
def brand_detail(request, pk):
    try:
        brand = Brand.objects.get(pk=pk)
    except Brand.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BrandSerializer(brand)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = BrandSerializer(brand, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        brand.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def brand_update(request, pk):
    try:
        brand = Brand.objects.get(pk=pk)
    except Brand.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = BrandSerializer(brand, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def brand_delete(request, pk):
    try:
        brand = Brand.objects.get(pk=pk)
    except Brand.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        brand.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
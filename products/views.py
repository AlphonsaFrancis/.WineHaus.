from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status

from authentication.models import User
from orders.models import Order, OrderItems
from .models import Product,Category,MadeOf,Country,Brand, Review, SentimentAnalysis
from .serializers import GetReviewSerializer, ProductSerializer,CategorySerializer,MadeOfSerializer,CountrySerializer,BrandSerializer, ReviewSerializer
from django.db.models import Q
from django.http import JsonResponse
from textblob import TextBlob
from django.db.models import Avg, Count

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from .models import Product, Category, Brand
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

import cv2
from PIL import Image
from sklearn.metrics.pairwise import cosine_similarity
import io
from rest_framework.parsers import MultiPartParser, FormParser
import numpy as np
import os
import pytesseract
from Levenshtein import ratio
import re

@api_view(['GET'])
def product_filter(request):
    category = request.query_params.get('category')
    brand = request.query_params.get('brand')
    country = request.query_params.get('country')
    made_of = request.query_params.get('made_of')
    sort = request.query_params.get('sort')

    # Building filters based on query parameters
    filters = Q()
    if category and category != 'all':
        filters &= Q(category__name=category)
    if brand and brand != 'all':
        filters &= Q(brand__name=brand)
    if country and country != 'all':
        filters &= Q(country__name=country)
    if made_of and made_of != 'all':
        filters &= Q(made_of__name=made_of)

    # Applying the filters
    products = Product.objects.filter(filters)

    # Sorting logic
    if sort == 'price-asc':
        products = products.order_by('price')
    elif sort == 'price-desc':
        products = products.order_by('-price')
    elif sort == 'rating':  # Assuming the Product model has a 'rating' field
        products = products.order_by('-rating')
    else:
        products = products.order_by('-created_at')  # Default sorting by newest

    # Serialize and return the products
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

from django.db.models import Q

@api_view(['GET'])
def list_products(request):
    # Get the search query parameter
    search_query = request.GET.get('search', '')

    if search_query:
        # Filter products based on search query
        products = Product.objects.filter(Q(name__icontains=search_query) | Q(description__icontains=search_query))
    else:
        # If no search query, return all products
        products = Product.objects.all()

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)  

def search_products(request):
    query = request.GET.get('q', '')
    products = Product.objects.filter(name__icontains=query)  # Filter by product name
    results = [{'id': product.id, 'name': product.name, 'price': product.price} for product in products]
    return JsonResponse(results, safe=False)

@api_view(['POST'])
def create_product(request):
    if request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
def update_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data.copy()

    image_data = data.get('image')
    if image_data == '' or image_data is None:
        data.pop('image', None)

    serializer = ProductSerializer(product, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
# @api_view(['GET'])
# def list_products(request):
#     if request.method == 'GET':
#         products = Product.objects.all()
#         serializer = ProductSerializer(products, many=True)
#         return Response(serializer.data)    

@api_view(['GET'])
def product_details(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    
@api_view(['DELETE'])
def delete_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        product.delete()
        return Response({'message': 'Product deleted successfully'}, status=status.HTTP_200_OK)    

@api_view(['POST'])
def disable_enable_product(request,pk):
    try:
        product = Product.objects.get(pk=pk)
        if product.is_active == True:
            product.is_active  = False
        else:
            product.is_active = True
        product.save()
        return Response({'message':f"Product active status changed to : {product.is_active} "},status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        print(f"ERROR: Product for this id doesnot exist!")
        return Response({'message': f"No Product found for the given id {pk}"},status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        print(f"ERROR: {e}")
        return Response({'message': f"An error occurred while processing your request"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# category function based views

@api_view(['GET'])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def category_create(request):
    name = request.data.get('name')
    
    # Check if a category with the same name already exists
    if Category.objects.filter(name=name).exists():
        return Response(
            {"error": "A category with this name already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Proceed with creating the category
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
        category.delete()
        return Response({'message':'category deleted'},status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({'error':"Item with this id does not exist"},status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def disable_enable_category(request,pk):
    try:
        category = Category.objects.get(pk=pk)
        if category.is_active == True:
            category.is_active  = False
        else:
            category.is_active = True
        category.save()
        return Response({'message':f"Category active status changed to : {category.is_active} "},status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        print(f"ERROR: Brand for this id doesnot exist!")
        return Response({'message': f"No Category found for the given id {pk}"},status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        print(f"ERROR: {e}")
        return Response({'message': f"An error occurred while processing your request"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

 
    
   
    

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

@api_view(['POST'])
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
        madeof.delete()
        return Response({'message':"Item deleted"},status=status.HTTP_200_OK)
    except MadeOf.DoesNotExist:
        return Response({'error':"Item with this id does not exist"},status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def disable_enable_madeof(request,pk):
    try:
        madeof = MadeOf.objects.get(pk=pk)
        if madeof.is_active == True:
            madeof.is_active  = False
        else:
            madeof.is_active = True
        madeof.save()
        return Response({'message':f"madeof active status changed to : {madeof.is_active} "},status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        print(f"ERROR: Brand for this id doesnot exist!")
        return Response({'message': f"No madeof found for the given id {pk}"},status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        print(f"ERROR: {e}")
        return Response({'message': f"An error occurred while processing your request"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    


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
        country.delete()
        return Response({'message':"Country deleted"},status=status.HTTP_200_OK)
    except Country.DoesNotExist:
        return Response({'error':"Item with this id does not exist"},status=status.HTTP_204_NO_CONTENT)



@api_view(['POST'])
def disable_enable_country(request,pk):
    try:
        country = Country.objects.get(pk=pk)
        if country.is_active == True:
            country.is_active  = False
        else:
            country.is_active = True
        country.save()
        return Response({'message':f"country active status changed to : {country.is_active} "},status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        print(f"ERROR: Brand for this id doesnot exist!")
        return Response({'message': f"No country found for the given id {pk}"},status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        print(f"ERROR: {e}")
        return Response({'message': f"An error occurred while processing your request"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    


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
        brand.delete()
        return Response({'message':"Brand deleted"},status=status.HTTP_200_OK)
    except Brand.DoesNotExist:
        return Response({'error':"Item with this id does not exist"},status=status.HTTP_204_NO_CONTENT)



@api_view(['POST'])
def disable_enable_brand(request,pk):
    try:
        brand = Brand.objects.get(pk=pk)
        if brand.is_active == True:
            brand.is_active  = False
        else:
            brand.is_active = True
        brand.save()
        return Response({'message':f"Brand active status changed to : {brand.is_active} "},status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        print(f"ERROR: Brand for this id doesnot exist!")
        return Response({'message': f"No Brand found for the given id {pk}"},status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        print(f"ERROR: {e}")
        return Response({'message': f"An error occurred while processing your request"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def product_search(request):
    # Get query parameters
    product_name = request.query_params.get('product_name', None)
    brand_name = request.query_params.get('brand_name', None)

    # Create filter conditions using Q objects
    filters = Q(is_active=True)
    if product_name:
        filters &= Q(name__icontains=product_name)
    if brand_name:
        filters &= Q(brand__name__icontains=brand_name)

    # Query the Product model
    products = Product.objects.filter(filters).distinct()
    serializer = ProductSerializer(products, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


def analyze_sentiment(comment):
    blob = TextBlob(comment)
    polarity = blob.sentiment.polarity
    if polarity > 0:
        return "Positive", polarity
    elif polarity < 0:
        return "Negative", polarity
    else:
        return "Neutral", polarity

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def create_review(request):
    try:
        product_id = request.data['product_id']
        user_email = request.data['user_email']
        order_id = request.data['order_id']
        product = Product.objects.get(product_id=product_id)
        user = User.objects.get(email=user_email)

        # Check if the user purchased the product
        if not OrderItems.objects.filter(user=user, product_id=product).exists():
            return Response({
                "success":"False",
                "message": "You have not purchased this product",
                "error":"You must have purchased the product to leave a review.",
                "status":status.HTTP_400_BAD_REQUEST
                }, status=status.HTTP_400_BAD_REQUEST)
            

        # Serialize and save review
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user, product=product)
            review = serializer.instance

            # Perform sentiment analysis
            sentiment, score = analyze_sentiment(review.comment)
            SentimentAnalysis.objects.create(review=review, sentiment=sentiment, score=score)
            return Response({
                "success": "True",
                "message": "Review created successfully",
                "data":serializer.data,
                "status": status.HTTP_201_CREATED,
            })

        return Response({
            "success": "False",
            "message": "Invalid data",
            "error": serializer.errors,
            "status": status.HTTP_400_BAD_REQUEST
        })
    except Product.DoesNotExist:
        return Response({
            "success": "False",
            "message": "Product not found",
            "error": "Product does not exist",
            "status": status.HTTP_404_NOT_FOUND
        })



@api_view(['PUT'])
def edit_review(request, review_id, user_id):
    try:
        # Fetch the user and order items to validate
        user = User.objects.get(id=user_id)
        # order_item = OrderItems.objects.filter(order_id=order_id, user=user).first()

        # if not order_item:
        #     return Response({
        #         "success": "False",
        #         "message": "Order not found or does not belong to the user",
        #         "error": "Invalid order or user",
        #         "status": status.HTTP_404_NOT_FOUND
        #     }, status=status.HTTP_404_NOT_FOUND)

        # Fetch the review associated with the order and user
        review = Review.objects.filter(id=review_id, user=user).first()
        if not review:
            return Response({
                "success": "False",
                "message": "Review not found",
                "error": "No review exists for this order and user",
                "status": status.HTTP_404_NOT_FOUND
            }, status=status.HTTP_404_NOT_FOUND)

        # Update the review
        serializer = ReviewSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": "True",
                "message": "Review updated successfully",
                "data": serializer.data,
                "status": status.HTTP_200_OK
            })

        return Response({
            "success": "False",
            "message": "Invalid data",
            "error": serializer.errors,
            "status": status.HTTP_400_BAD_REQUEST
        })

    except User.DoesNotExist:
        return Response({
            "success": "False",
            "message": "User not found",
            "error": "User does not exist",
            "status": status.HTTP_404_NOT_FOUND
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def list_reviews(request, product_id):
    try:
        reviews = Review.objects.filter(product_id=product_id)
        serializer = GetReviewSerializer(reviews, many=True)
        return Response({
            "success": "True",
            "message": "Reviews listed successfully",
            "data": serializer.data,
            "status": status.HTTP_200_OK
        })
    except Product.DoesNotExist:
        return Response({
            "success": "False",
            "message": "Product not found",
            "error": "Product does not exist",
            "status": status.HTTP_404_NOT_FOUND 
        })
    


@api_view(['GET'])
def product_review_sentiment_summary(request, product_id):
    try:
        average_rating = Review.objects.filter(product_id=product_id).aggregate(Avg('rating'))['rating__avg']
        sentiments = SentimentAnalysis.objects.filter(review__product_id=product_id)
        total_sentiments = sentiments.count()

        sentiment_summary = sentiments.values('sentiment').annotate(count=Count('sentiment'))
        average_score = sentiments.aggregate(Avg('score'))['score__avg']

        sentiment_percentage = {
            sentiment['sentiment']: f"{round((sentiment['count'] / total_sentiments) * 100, 2)}%"
            for sentiment in sentiment_summary
        } if total_sentiments > 0 else {}

        response_data = {
            "product_id":product_id,
            "average_rating": round(average_rating, 2) if average_rating else 0,
            "average_score": round(average_score, 2) if average_score else 0,
            "sentiment_summary":sentiment_percentage
        }
        return Response({
            "success": "True",
            "message": "Product review sentiment summary listed successfully",
            "data": response_data,
            "status": status.HTTP_200_OK
        })
    except Exception as e:
        return Response({
            "success": "False",
            "message": "An error occurred",
            "error": str(e),
            "status": status.HTTP_500_INTERNAL_SERVER_ERROR
        })
    
@api_view(['GET'])
def user_review_sentiment_summary(request, order_id):
    try:
        average_rating = Review.objects.filter(order_id=order_id).aggregate(Avg('rating'))['rating__avg']
        sentiments = SentimentAnalysis.objects.filter(review__order_id=order_id)
        total_sentiments = sentiments.count()

        sentiment_summary = sentiments.values('sentiment').annotate(count=Count('sentiment'))
        average_score = sentiments.aggregate(Avg('score'))['score__avg']

        sentiment_percentage = {
            sentiment['sentiment']: f"{round((sentiment['count'] / total_sentiments) * 100, 2)}%"
            for sentiment in sentiment_summary
        } if total_sentiments > 0 else {}

        response_data = {
            "order_id": order_id,
            "average_rating": round(average_rating, 2) if average_rating else 0,
            "average_score": round(average_score, 2) if average_score else 0,
            "sentiment_summary": sentiment_percentage
        }
        return Response({
            "success": "True",
            "message": "User review sentiment summary listed successfully",
            "data": response_data,
            "status": status.HTTP_200_OK
        })
    except Exception as e:
        return Response({
            "success": "False",
            "message": "An error occurred",
            "error": str(e),
            "status": status.HTTP_500_INTERNAL_SERVER_ERROR
        })


@api_view(['GET'])
def list_reviews_by_user(request, user_id):
    try:
        reviews = Review.objects.filter(user_id=user_id)
        serializer = GetReviewSerializer(reviews, many=True)
        return Response({
            "success": "True",
            "message": "Reviews listed successfully",
            "data": serializer.data,
            "status": status.HTTP_200_OK
        })
    except Review.DoesNotExist:
        return Response({
            "success": "False",
            "message": "User not found",
            "error": "User does not exist",
            "status": status.HTTP_404_NOT_FOUND 
        })

@api_view(["GET"])
def get_similar_products(request):
    try:
        category_id = request.GET.get('category', None)
        brand_id = request.GET.get('brand', None)
        product_id = request.GET.get('product', None)
        page = request.GET.get('page', 1)
        per_page = request.GET.get('per_page', 10)

        if not category_id and not brand_id:
            return JsonResponse({
                'error': 'Provide either category or brand parameter'
            }, status=400)

        # Base query excluding the current product
        base_query = Product.objects.filter(is_active=True)
        if product_id:
            base_query = base_query.exclude(product_id=product_id)

        # Filter by category
        if category_id:
            category = get_object_or_404(Category, pk=category_id)
            category_products = base_query.filter(category=category)
        else:
            category_products = Product.objects.none()

        # Filter by brand
        if brand_id:
            brand = get_object_or_404(Brand, pk=brand_id)
            brand_products = base_query.filter(brand=brand)
        else:
            brand_products = Product.objects.none()

        # Combine products, removing duplicates
        all_products = list(set(category_products) | set(brand_products))
        all_products.sort(key=lambda x: x.created_at, reverse=True)

        # Pagination
        paginator = Paginator(all_products, per_page)
        
        try:
            paginated_products = paginator.page(page)
        except (PageNotAnInteger, EmptyPage):
            paginated_products = paginator.page(1)

        # Serialize products
        product_list = [{
            'product_id': product.product_id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'stock_quantity': product.stock_quantity,
            'image': product.image.url if product.image else None,
            'brand': product.brand.name,
            'category': product.category.name
        } for product in paginated_products]

        return JsonResponse({
            'products': product_list,
            'total_products': len(all_products),
            'total_pages': paginator.num_pages,
            'current_page': paginated_products.number
        })

    except (Category.DoesNotExist, Brand.DoesNotExist):
        return JsonResponse({
            'error': 'Invalid category or brand'
        }, status=404)

    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def search_by_image(request):
    try:
        if 'image' not in request.FILES:
            return Response({
                'error': 'No image file provided'
            }, status=status.HTTP_400_BAD_REQUEST)

        uploaded_image = request.FILES['image']
        
        try:
            # Convert uploaded image to OpenCV format
            image_bytes = np.frombuffer(uploaded_image.read(), np.uint8)
            img = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)
            
            # Enhanced image preprocessing for text detection
            # Resize while maintaining aspect ratio
            height = 1000  # Increased height for better text detection
            aspect_ratio = img.shape[1] / img.shape[0]
            width = int(height * aspect_ratio)
            img = cv2.resize(img, (width, height))

            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Apply adaptive thresholding
            binary = cv2.adaptiveThreshold(
                gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                cv2.THRESH_BINARY, 11, 2
            )

            # Denoise
            denoised = cv2.fastNlMeansDenoising(binary)
            
            # Apply dilation to make text more prominent
            kernel = np.ones((2,2), np.uint8)  # Increased kernel size
            dilated = cv2.dilate(denoised, kernel, iterations=1)

            # Configure Tesseract parameters for better text detection
            custom_config = r'--oem 3 --psm 11'
            
            # Extract text using Tesseract with custom configuration
            extracted_text = pytesseract.image_to_string(dilated, config=custom_config)
            
            # Clean and process the extracted text
            cleaned_text = ' '.join(re.findall(r'\b\w+\b', extracted_text.lower()))
            words = [word for word in cleaned_text.split() if len(word) > 2]
            cleaned_text = ' '.join(words)

            print(f"Extracted text: {cleaned_text}")  # Debug print

            # First try exact name matches
            exact_matches = Product.objects.filter(
                Q(name__iexact=cleaned_text) |
                Q(name__icontains=cleaned_text)
            ).distinct()

            if exact_matches.exists():
                print("Found exact matches")
                top_products = list(exact_matches[:6])
            else:
                print("No exact matches, trying word matching")
                # If no exact matches, try matching individual words
                words = cleaned_text.split()
                similar_products = []

                for product in Product.objects.all():
                    # Calculate similarity with product name
                    name_similarity = ratio(cleaned_text, product.name.lower())
                    
                    # Check if any word from the extracted text appears in the product name
                    word_match = any(word in product.name.lower() for word in words if len(word) > 2)
                    
                    if name_similarity > 0.5 or word_match:  # Increased threshold for better precision
                        similar_products.append((product, name_similarity))
                        print(f"Match found: {product.name} (Score: {name_similarity})")

                # Sort by similarity score
                similar_products.sort(key=lambda x: x[1], reverse=True)
                top_products = [product for product, _ in similar_products[:6]]

                # If still no matches, try broader search
                if not top_products:
                    print("No similar matches, trying broader search")
                    q_objects = Q()
                    for word in words:
                        if len(word) > 2:
                            q_objects |= Q(name__icontains=word)
                    products = Product.objects.filter(q_objects).distinct()[:6]
                    top_products = list(products)

            serializer = ProductSerializer(top_products, many=True)
            
            return Response({
                'success': True,
                'extracted_text': cleaned_text,
                'products': serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error processing image: {str(e)}")
            return Response({
                'error': 'Error processing image'
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print(f"Server error: {str(e)}")
        return Response({
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

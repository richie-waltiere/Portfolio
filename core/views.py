from django.shortcuts import render

def index(request):
    return render(request, 'index.html')

def additional_info(request):
    return render(request, 'additional_info.html')

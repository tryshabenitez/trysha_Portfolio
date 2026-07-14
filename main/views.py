from django.shortcuts import render

from django.shortcuts import render

def landing(request):
    return render(request, 'portfolio.html')
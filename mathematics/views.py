from django.template import RequestContext
from django.urls import reverse
from django.shortcuts import render, redirect
# from random import randint, shuffle
# from html import escape

def mathematics(request):
    return render(request, 'mathematics.html')

def archimedes(request):
    return render(request, 'archimedes/archimedes_approximation.html')

def combinatorics(request):
    return render(request, 'combinatorics/combinatorics.html')

def poker_hands(request):
    # suits = [
    #         '<span style="color: red">&diams;</span>',
    #         '<span style="color: red">&hearts;</span>',
    #         '&clubs;',
    #         '&spades;',
    #         ]
    # values = [str(digit) for digit in range(2,11)] + ['J', 'Q', 'K', 'A']
    # cards = {"cards": [value + suit for suit in suits for value in values]}

    return render(request, 'combinatorics/poker_hands.html')

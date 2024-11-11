import requests
from bs4 import BeautifulSoup

def get_match_game_airings(schedule_date):
    
    mg_eps_and_times = []
    r = requests.get('https://www.gameshownetwork.com/schedule'
                    .format(schedule_date))

    soup = BeautifulSoup(r.text, 'html.parser')
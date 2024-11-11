import requests, csv
from bs4 import BeautifulSoup

def get_match_game_airings(schedule_date):
    
    mg_eps_and_times = []
    r = requests.get('https://www.gameshownetwork.com/schedule'
                    .format(schedule_date))

    soup = BeautifulSoup(r.text, 'html.parser')

    schedule_items = soup.find('script', src ="//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js")

    if not schedule_items:
        return[]
    
    for item in schedule_items:
        episode = item.find()
        title = episode['title']
        if 'Match Game' in title:
            title_parts = title.split('_')
            show_name = title_parts[0]
            title = int(title_parts[1])
            ep_time = episode['timeOfDay']
            mg_eps_and_times.append((ep_time.strip(),show_name,title))

    with open('MG.csv','w', newline='') as csvfile:
        filednames = [mg_eps_and_times]

        writer = csv.DictWriter(csvfile, fieldnames=filednames)
        writer.writeheader()
        writer.writerows(mg_eps_and_times)


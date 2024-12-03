import sys
import os
import pytest
import json

sys.path.insert(0, '/Users/brodee69/Documents/GitHub/CarInfo/CarInfo/app')
os.chdir('/Users/brodee69/Documents/GitHub/CarInfo/CarInfo/app') 

#Change to this when using Kyler's route: /mnt/c/Users/mrkcb/OneDrive/Documents/GitHub/CarInfo/CarInfo/app

#Brodee's route = /Users/brodee69/Documents/GitHub/CarInfo/CarInfo/app

from app import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_some_route(client):
    response = client.get('/cars')
    assert response.status_code == 200



def test_brand_template(client):
    with open("JSON/cars.JSON") as json_file:
        cars = json.load(json_file)

        for country in cars.keys(): 
            for brand in cars[country].keys():

                url = f"/car/{country}/{brand}"

                response = client.get(url)

                assert response.status_code == 200, f"failed for {country} - {brand}"


def test_car_template(client):
    with open("JSON/cars.JSON") as json_file:
        cars = json.load(json_file)

        for country in cars.keys(): 
            for brand in cars[country].keys():

                del cars[country][brand]['logo']
                
                for car in cars[country][brand].keys():

                    url = f"/{country}/{brand}/{car}"

                    response = client.get(url)

                    assert response.status_code == 200, f"failed for {country} - {brand} - {car}"


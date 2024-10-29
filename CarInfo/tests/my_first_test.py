import sys
import os
import pytest

sys.path.insert(0, '/Users/brodee69/Documents/GitHub/CarInfo/CarInfo/app')
os.chdir('/Users/brodee69/Documents/GitHub/CarInfo/CarInfo/app')

#Brodee's route = /Users/brodee69/Documents/GitHub/CarInfo/CarInfo/app

from app import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_some_route(client):
    response = client.get('/cars')
    assert response.status_code == 200


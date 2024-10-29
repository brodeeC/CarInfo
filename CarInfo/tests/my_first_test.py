import sys
import os
import pytest

sys.path.insert(0, '/path/to/your/app')
os.chdir('/path/to/your/app')

from app import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_some_route(client):
    response = client.get('/some_route')
    assert response.status_code == 200


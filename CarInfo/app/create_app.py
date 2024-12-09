

def create_app(test_config=False, shared_server=False):
    app = Flask(__name__)
    app.config['TESTING'] = test_config
    app.config['SHARED_SERVER'] = shared_server
    prepend = ''
    if app.config['SHARED_SERVER']:
        prepend = '/matchgame'
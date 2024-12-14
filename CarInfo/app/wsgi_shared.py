from app import create_app
app = create_app(shared_server=False)


if __name__ == '__main__':
 app.run()
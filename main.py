import flask

app = flask.Flask(__name__)

@app.route('/')
def main_page():
    return 'Hello, world!'

if (__name__ == '__main__'):
    app.run()



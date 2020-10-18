import config
import flask

app = flask.Flask(__name__)


@app.route('/')
def index():
    return flask.render_template('index.html')


@app.route('/ok_page')
def ok_page():
    return "OK"


@app.route('/get_data', methods=['POST'])
def get_data():
    my_dict = flask.request.form
    return flask.render_template('get_data.html', data=my_dict)

if (__name__ == '__main__'):
    app.run(host=config.MY_HOST)

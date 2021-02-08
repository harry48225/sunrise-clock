from flask import Flask, jsonify, request
from flask_cors import CORS

import sqlite3
from uuid import uuid4

DATABASE = 'alarms.db'

# Load the database

database_conn = sqlite3.connect(DATABASE)

cursor = database_conn.cursor()

# Create the alarms table, if it already exists it doesn't get overwritten

# Table is
# id, time, mon, tue, wed, thur, fri, sat, sun
# text,text, num, num, num,   num, num, num, num

# Where the numbers in mon, tue, wed, etc. act as booleans 1 being true and 0 being false
cursor.execute('''CREATE TABLE IF NOT EXISTS alarms (id TEXT PRIMARY KEY,\
                                                time TEXT,\
                                                mon INTEGER,\
                                                tue INTEGER,\
                                                wed INTEGER,\
                                                thur INTEGER,\
                                                fri INTEGER,\
                                                sat INTEGER,\
                                                sun INTEGER)''')

database_conn.close()

def get_database():

    return sqlite3.connect(DATABASE)

app = Flask(__name__)

CORS(app)

@app.route('/')
def index():
    return jsonify({'about':'Welcome to the alarm clock'})

@app.route('/add_alarm', methods=['POST'])
def add_alarm():
    # Expects a json {'time': 'HH:mm'}
    n_alarm = request.get_json()

    # Create a unique id for the alarm
    id = str(uuid4())

    d = get_database()

    cursor = d.cursor()
    # Add the alarm to the database
    cursor.execute('''INSERT INTO alarms VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                    [id, n_alarm['time'], 0, 0, 0, 0, 0, 0, 0])

    d.commit()
    d.close()

    return "added"

@app.route('/get_alarms', methods=['GET'])
def get_alarms():
    ''' Get the alarms and return as JSON, sorted by time '''

    alarm_list = []

    d = get_database()
    for alarm_row in d.cursor().execute('SELECT * FROM alarms ORDER BY time'):
        # might be a better way to do this ...
        alarm = {'id':alarm_row[0], 'time':alarm_row[1], 'mon':alarm_row[2], 'tue':alarm_row[3],
                'wed':alarm_row[4], 'thur':alarm_row[5], 'fri':alarm_row[6], 'sat':alarm_row[7],
                'sun':alarm_row[8]}

        alarm_list.append(alarm)

    d.close()

    return jsonify({'alarms': alarm_list})

@app.route('/delete_alarm', methods=['POST'])
def delete_alarm():
    ''' Deletes an alarm given the id '''

    deletion_id = request.get_json()['id']

    d = get_database()

    d.cursor().execute('DELETE FROM alarms WHERE id=?', [deletion_id])

    d.commit()
    d.close()

    return "deleted"

@app.route('/modify_alarm', methods=['POST'])
def modify_alarm():
    ''' Give an id and the fields to modify '''

    ''' Expects a json of the form {'id': <id to modify>, 'fields': {<field name>:<new_value>, etc.}'''

    request_json = request.get_json()
    update_id = request_json['id']

    fields_to_update = request_json['fields']

    d = get_database()

    for field in fields_to_update:

        print(f"key: {field}, value:{fields_to_update[field]}")

        # .format poses an injection risk!
        d.cursor().execute('UPDATE alarms SET {} = ? WHERE id = ?'.format(field), [fields_to_update[field], update_id])

    d.commit()
    d.close()
    return "modified"


if __name__ == '__main__':
    app.run(debug=True)
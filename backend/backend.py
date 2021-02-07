from flask import Flask, jsonify, request
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


if __name__ == '__main__':
    app.run(debug=True)
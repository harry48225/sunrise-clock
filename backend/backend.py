from flask import Flask, jsonify, request
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler

import sqlite3
from uuid import uuid4

from datetime import date, datetime, timedelta

from kelvin_to_rgb import convert_K_to_RGB

from numpy import interp

BUILD_UP_LENGTH = 30*60 # Number of seconds alarm should take to reach full intensity
SUSTAIN = 25*60 # Number of seconds to sustain the max brightness
COOL_DOWN = 60 # Number of seconds to cooldown

START_TEMP = 1500
END_TEMP = 6500

DAYS_OF_WEEK = ['mon', 'tue', 'wed', 'thur', 'fri', 'sat', 'sun']

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


# Create the sunsets table, if it already exists it doesn't get overwritten
# end_time should be unix time
cursor.execute('''CREATE TABLE IF NOT EXISTS sunsets (id TEXT PRIMARY KEY,\
                                                    end_time REAL)''')

# Create a table that stores the current colour of the alarm
cursor.execute('''CREATE TABLE IF NOT EXISTS colours (red INTEGER,\
                                                    green INTEGER,\
                                                    blue INTEGER,\
                                                    white INTEGER)''')

# Insert a blank colour if the table is empty

table_length = cursor.execute("SELECT COUNT(*) FROM colours").fetchone()[0]
if table_length == 0:
    cursor.execute('''INSERT INTO colours VALUES (?,?,?,?)''', (0,0,0,0))


database_conn.commit()
database_conn.close()

def get_database():

    return sqlite3.connect(DATABASE)

app = Flask(__name__)

CORS(app)

def update_colour_from_alarms():
    ''' checks the alarms table and determines the colour that the alarm should be '''
    current_day = DAYS_OF_WEEK[date.today().weekday()]
    r,g,b,w = 0,0,0,0

    d = get_database()

    alarm_times = []
    # Get the alarms from the database that are scheduled for today
    for time in d.cursor().execute(f'SELECT time FROM alarms WHERE {current_day}=1'):

        time_split = time[0].split(":")

        hours = int(time_split[0])
        minutes = int(time_split[1])

        alarm_times.append(datetime.now().replace(hour=hours, minute=minutes, second=0, microsecond=0))

    for alarm in alarm_times:

        # See which alarms have yet to come
        time_until_alarm = datetime.now() - alarm
        update = False

        # Construct a linear interpolation

        xp_timedelta = [-timedelta(seconds=BUILD_UP_LENGTH), timedelta(), timedelta(seconds=SUSTAIN), timedelta(seconds=(SUSTAIN+COOL_DOWN))]
        xp = [timedelta.total_seconds() for timedelta in xp_timedelta]
        yp = [START_TEMP, END_TEMP, END_TEMP, START_TEMP]

        if xp_timedelta[0] <= time_until_alarm <= xp_timedelta[-1]:
            colour_temp = interp(time_until_alarm.total_seconds(), xp, yp)

            r,g,b= convert_K_to_RGB(colour_temp)
                    
            r = int(r)
            g = int(g)
            b = int(b)
            w = b # lock w to b for now

            update = True  

        if xp_timedelta[-1] < time_until_alarm < xp_timedelta[-1] + timedelta(seconds = 10):
            r,g,b,w = 0,0,0,0

            update = True
        if update:
            d.cursor().execute(f'UPDATE colours SET red = ?, green = ?, blue = ?, white = ?', (r,g,b,w))
            d.commit()
    d.close()

def update_colour_from_sunsets():
    ''' checks the sunset table and determines what colour the alarm should be'''

    d = get_database()

    # Get all the sunset end times from the database
    for end_time in d.cursor().execute('SELECT end_time FROM sunsets'):

        time_until_sunset_end = datetime.fromtimestamp(end_time[0]) - datetime.now()
        #print(time_until_sunset_end)
        # if the sunset hasn't already passed
        if time_until_sunset_end > timedelta():

            # Currently configured for sunsets at maximum of 30 mins long
            # Interpolate between 1500K and 4000K
            colour_temp = interp(time_until_sunset_end.total_seconds(), [0, 60*30], [1500, 4000])

            r,g,b= convert_K_to_RGB(colour_temp)
                    
            r = int(r)
            g = int(g)
            b = int(b)
            w = b//2 # lock w to b for now

            d.cursor().execute(f'UPDATE colours SET red = ?, green = ?, blue = ?, white = ?', (r,g,b,w))
            d.commit()

        # if the sunset has already passed
        if time_until_sunset_end < timedelta():
            #print("removing")
            r,g,b,w = 0,0,0,0

            d.cursor().execute(f'UPDATE colours SET red = ?, green = ?, blue = ?, white = ?', (r,g,b,w))
            d.cursor().execute('DELETE FROM sunsets WHERE end_time = ?', (end_time)) # Delete the sunset from the database
            d.commit()

    d.close()


def update_colour():
    ''' called periodically and computes the colour that the alarm should be '''

    update_colour_from_alarms()
    update_colour_from_sunsets()

    




# Make the update_colour function run every second

scheduler = BackgroundScheduler()
scheduler.start()

scheduler.add_job(update_colour, 'interval', seconds=1)


@app.route('/api')
def index():
    return jsonify({'about':'Welcome to the alarm clock api'})

@app.route('/api/get_colour_rgbw', methods=['GET'])
def get_colour():
    ''' Returns the colour that the alarm should be'''
    
    d = get_database()

    for colour_row in d.cursor().execute('SELECT red, green, blue, white from colours'):
        print(colour_row)

        r = colour_row[0]
        g = colour_row[1]
        b = colour_row[2]
        w = colour_row[3]

    return jsonify({'r':r, 'g':g, 'b':b, 'w':w})

@app.route('/api/add_alarm', methods=['POST'])
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

@app.route('/api/get_alarms', methods=['GET'])
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

@app.route('/api/delete_alarm', methods=['POST'])
def delete_alarm():
    ''' Deletes an alarm given the id '''

    deletion_id = request.get_json()['id']

    d = get_database()

    d.cursor().execute('DELETE FROM alarms WHERE id=?', [deletion_id])

    d.commit()
    d.close()

    return "deleted"

@app.route('/api/modify_alarm', methods=['POST'])
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

@app.route('/api/set_colour_rgb', methods=['POST'])
def set_colour_rgb():

    request_json = request.get_json()
    print(request_json)
    r = int(request_json['red'])
    g = int(request_json['green'])
    b = int(request_json['blue'])


    d = get_database()
    d.cursor().execute('UPDATE colours SET red = ?, green = ?, blue = ?, white = ?', (r,g,b,0))
    d.commit()
    d.close()
    return "colour set"

@app.route('/api/start_sunset', methods=['POST'])
def start_sunset():
    ''' Starts a sunset from the current time for the given length '''
    ''' request {'duration': <minutes as int>}'''
    request_json = request.get_json()
    print(request_json)
    duration = int(request_json['duration'])

    end_timestamp = (datetime.now() + timedelta(minutes=duration)).timestamp()

    # Create a unique id for the alarm
    id = str(uuid4())
    d = get_database()

    d.cursor().execute('''INSERT INTO sunsets VALUES (?,?)''', [id, end_timestamp])

    d.commit()
    d.close()

    return "sunset started"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
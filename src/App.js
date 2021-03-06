import TimeWave from './TimeWave';
import AlarmTable from './AlarmTable';
import AlarmCreator from './AlarmCreator';
import SunsetPanel from './SunsetPanel';

import { Typography, Layout } from 'antd';
import { Card } from 'antd';


import './App.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { useState } from 'react';
import { useEffect } from 'react';
import UserColourPicker from './UserColourPicker';


import combee_gif from './assets/combee-cropped.gif'



function App() {

  
  const apiUrl = "/api/";

  const [alarm_list, set_alarms_list] = useState();

  function start_sunset(duration) {

    fetch(apiUrl+"start_sunset", { method: 'POST',
                                  headers: {'Content-Type': 'application/json'},
                                 body: JSON.stringify({duration: duration}) })
  }

  function delete_alarm(id) {
    // Takes the id of an alarm and deletes it
    fetch(apiUrl+"delete_alarm", { method: 'POST', 
                                  headers: {'Content-Type': 'application/json'},
                                  body: JSON.stringify({id:id}) }).then(() => get_alarms())
  }

  function add_alarm(time) {
    // Takes a time "HH:mm" and adds it to the database
    fetch(apiUrl+"add_alarm", { method: 'POST', 
                                  headers: {'Content-Type': 'application/json'},
                                  body: JSON.stringify({time:time}) }).then(() => get_alarms())
  }

  function modify_alarm(id, fields) {

    // Takes the id of the alarm to modify
    // and then the fields 
    // {'id': <id to modify>, 'fields': {<field name>:<new_value>, etc.}
    fetch(apiUrl+"modify_alarm", { method: 'POST', 
                                  headers: {'Content-Type': 'application/json'},
                                  body: JSON.stringify({id:id, fields:fields}) }).then(() => get_alarms())
  }

  function set_colour(red, green, blue) {
    // Sets the colour of the clock

    fetch(apiUrl+"set_colour_rgb", {method: 'POST',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({red: red, green: green, blue:blue})});
  }
  
  function get_alarms() {
    let response_json;
    response_json = fetch(apiUrl+"get_alarms").then((response) => { return response.json();})
    
    let formatted_data = [];
    response_json.then((data) => {
      
      // Put the alarm data into the correct format
     
      data.alarms.forEach(alarm => {

        const formatted_alarm = {
          key: alarm.id,
          time: alarm.time,
          days: {mon: alarm.mon === 1, tue: alarm.tue === 1, wed: alarm.wed === 1, thur: alarm.thur === 1, fri: alarm.fri === 1, sat: alarm.sat === 1, sun: alarm.sun === 1},
        };

        console.log(formatted_alarm);
        formatted_data.push(formatted_alarm);
      }) 

    set_alarms_list(formatted_data);

    console.log(alarm_list)
    })
    
  }

  const { Header, Content, Footer } = Layout;
  const { Title } = Typography;

  
  useEffect(() => get_alarms(), [])
  
  return (
    <div className="App">
      <Header className='header'>
        <Title style={{marginBottom: 0, color: 'whitesmoke', flexGrow: 4}} underline={true} strong={true} code={true}>sunrise.local</Title>
        <img src={combee_gif} alt="combee" style={{margin: 0, float: 'right'}}/>
      </Header>
      <Content>
        <Card className="card">
          <TimeWave></TimeWave>
        </Card>
        <Card className="card">
          <AlarmTable alarm_list={alarm_list} modify_alarm={modify_alarm} delete_alarm={delete_alarm}></AlarmTable>
        </Card>
        <Card className="card">
          <AlarmCreator add_alarm_callback={add_alarm}></AlarmCreator>
        </Card>
        <Card className="card">
          <SunsetPanel start_sunset={start_sunset} />
        </Card>
        <Card className="card">
          <UserColourPicker set_colour_callback={set_colour} />
        </Card>
      </Content>
      <Footer className='footer'><code style={{color: 'whitesmoke'}}>i had virtually no rehearsal for that. 🐝</code><code style={{color: 'whitesmoke', float: 'right'}}>feb 2021</code></Footer>
    </div>
  );
}

export default App;

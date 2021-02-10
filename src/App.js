import TimeWave from './TimeWave';
import AlarmTable from './AlarmTable';
import AlarmCreator from './AlarmCreator';

import { Typography, Layout } from 'antd';
import { Card } from 'antd';


import './App.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { useState } from 'react';
import { useEffect } from 'react';



function App() {

  
  const apiUrl = "/api/";

  const [alarm_list, set_alarms_list] = useState();

  
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
      <Header className='clearfix'><div className="topBar"><Title underline={true}>Alarm</Title></div></Header>
      <Content>
        <Card style={{ margin: 20}}>
          <TimeWave></TimeWave>
        </Card>
        <Card style={{ margin: 20}}>
          <AlarmTable alarm_list={alarm_list}></AlarmTable>
        </Card>
        <Card style={{ margin: 20}}>
          <AlarmCreator></AlarmCreator>
        </Card>
      </Content>
    </div>
  );
}

export default App;

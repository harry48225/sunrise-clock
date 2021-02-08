import TimeWave from './TimeWave';
import AlarmTable from './AlarmTable';
import AlarmCreator from './AlarmCreator';

import { Typography, Layout } from 'antd';
import { Card } from 'antd';


import './App.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { useState } from 'react';



function App() {

  
  const apiUrl = "http://localhost:5000/";

  const { Header, Content, Footer } = Layout;
  const { Title } = Typography;

  const [alarm_list, set_alarms_list] = useState();


  function get_alarms() {
    let response_json;
    response_json = fetch(apiUrl).then((response) => { return response.json();})
    
    response_json.then((data) => console.log(data))
  }
  
  get_alarms()

  return (
    <div className="App">
      <Header class='clearfix'><div class="topBar"><Title underline={true}>Alarm</Title></div></Header>
      <Content>
        <Card style={{ margin: 20}}>
          <TimeWave></TimeWave>
        </Card>
        <Card style={{ margin: 20}}>
          <AlarmTable></AlarmTable>
        </Card>
        <Card style={{ margin: 20}}>
          <AlarmCreator></AlarmCreator>
        </Card>
      </Content>
    </div>
  );
}

export default App;

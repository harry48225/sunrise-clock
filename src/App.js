import TimeWave from './TimeWave';
import AlarmTable from './AlarmTable';

import { Typography, Layout } from 'antd';
import { Card } from 'antd';


import './App.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'



function App() {

  const { Header, Content, Footer } = Layout;
  const { Title } = Typography;


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
      </Content>
    </div>
  );
}

export default App;

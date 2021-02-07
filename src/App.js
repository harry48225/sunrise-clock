import TimeWave from './TimeWave';

import { Typography, Layout } from 'antd';
import { Card } from 'antd';


import './App.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import AlarmTable from './AlarmTable';


function App() {

  const { Header, Content, Footer } = Layout;
  const { Title } = Typography;


  return (
    <div className="App">
      <Header><Title className="header">alarm</Title></Header>
      <Card style={{ margin: 20}}>
        <TimeWave></TimeWave>
      </Card>
      <Card style={{ margin: 20}}>
        <AlarmTable></AlarmTable>
      </Card>
    </div>
  );
}

export default App;

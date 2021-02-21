import DayButtons from './DayButtons';


import { Table, Button } from 'antd';
import { DeleteOutlined, SolutionOutlined } from '@ant-design/icons'
import {useState, useEffect} from 'react';
import React from 'react';


function AlarmTable({alarm_list, modify_alarm, delete_alarm}) {

  const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (time, record) => (
        <>
          <code style={{fontSize: 16, marginLeft: -5,marginRight: 0}}>{time}</code>
        </>
      ),
    },
    {
      title: 'Days',
      dataIndex: 'days',
      key: 'days',
      
      render: (days, record) => (
        <>
            <DayButtons days={days} modify_alarm={(day) => modify_alarm(record.key, day)}/>
        </>

      ),
      
    },
    {
        title: '',
        dataIndex: 'actions',
        key: 'actions',
        render: (actions, record) => (
            <Button icon={<DeleteOutlined />} onClick={() => delete_alarm(record.key)}/>
        )

    }
  ];
  return (
    <div>
      <Table style={{ border: '4px solid #C1CDCD', borderRadius: 15, padding:5}} dataSource={alarm_list} columns={columns} pagination={false} showHeader={false}/>
    </div>
  );
}

export default AlarmTable;


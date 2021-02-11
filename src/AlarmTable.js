import DayButtons from './DayButtons';


import { Table, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'
import {useState, useEffect} from 'react';
import React from 'react';


function AlarmTable({alarm_list, modify_alarm, delete_alarm}) {

  const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
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
      <Table dataSource={alarm_list} columns={columns} />
  )
}

export default AlarmTable;


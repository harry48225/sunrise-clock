import DayButtons from './DayButtons';


import { Table, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'
import {useState, useEffect} from 'react';
import React from 'react';


function AlarmTable({alarm_list}) {

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
      
      render: days => (
        <>
            <DayButtons days={days}/>
        </>

      ),
      
    },
    {
        title: '',
        dataIndex: 'actions',
        key: 'actions',
        render: () => (
            <Button icon={<DeleteOutlined />}/>
        )

    }
  ];
  return (
      <Table dataSource={alarm_list} columns={columns} />
  )
}

export default AlarmTable;


import DayButtons from './DayButtons';

import { Table, Button } from 'antd';
import React from 'react';


function AlarmTable() {

    const dataSource = [
        {
          key: '1',
          time: '07:10',
          days: {mon: true, tue: true, wed: true, thur: true, fri: true, sat: true, sun: true},
        },
        {
          key: '2',
          time: '08:00',
          days: {mon: false, tue: true, wed: false, thur: true, fri: true, sat: false, sun: true},
        },
      ];
      
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
      ];

    return (
        <Table dataSource={dataSource} columns={columns} />
    )
}

export default AlarmTable;


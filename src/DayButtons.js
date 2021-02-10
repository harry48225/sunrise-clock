import React from 'react';
import { Button, Row } from 'antd';

function DayButtons({days, modify_alarm}) {

    return (
    <>
        <Row justify='space-around'>
        <Button shape="circle" className="dayButton" type={days.mon ? 'primary' : 'dashed'} onClick={() => modify_alarm({mon: !days.mon})}>M</Button>
        <Button shape="circle" className="dayButton" type={days.tue ? 'primary' : 'dashed'} onClick={() => modify_alarm({tue: !days.tue})}>T</Button>
        <Button shape="circle" className="dayButton" type={days.wed ? 'primary' : 'dashed'} onClick={() => modify_alarm({wed: !days.wed})}>W</Button>
        <Button shape="circle" className="dayButton" type={days.thur ? 'primary' : 'dashed'} onClick={() => modify_alarm({thur: !days.thur})}>T</Button>
        <Button shape="circle" className="dayButton" type={days.fri ? 'primary' : 'dashed'} onClick={() => modify_alarm({fri: !days.fri})}>F</Button>
        <Button shape="circle" className="dayButton" type={days.sat ? 'primary' : 'dashed'} onClick={() => modify_alarm({sat: !days.sat})}>S</Button>
        <Button shape="circle" className="dayButton" type={days.sun ? 'primary' : 'dashed'} onClick={() => modify_alarm({sun: !days.sun})}>S</Button>
        </Row>
    </>
    )
}

export default DayButtons;
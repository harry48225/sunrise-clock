import React from 'react';
import { Button } from 'antd';

function DayButtons({days}) {
    return (
    <>
        <Button className="dayButton" type={days.mon ? 'primary' : 'dashed'}>M</Button>
        <Button className="dayButton" type={days.tue ? 'primary' : 'dashed'}>T</Button>
        <Button className="dayButton" type={days.wed ? 'primary' : 'dashed'}>W</Button>
        <Button className="dayButton" type={days.thur ? 'primary' : 'dashed'}>T</Button>
        <Button className="dayButton" type={days.fri ? 'primary' : 'dashed'}>F</Button>
        <Button className="dayButton" type={days.sat ? 'primary' : 'dashed'}>S</Button>
        <Button className="dayButton" type={days.sun ? 'primary' : 'dashed'}>S</Button>
    </>
    )
}

export default DayButtons;
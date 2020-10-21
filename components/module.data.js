import React, { Component } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine, ReferenceArea,
  ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
  Label, LabelList } from 'recharts';
export const DataDetail = ({data}) => {

  if(!data.length && !data.results){
      return <p className="center">Not data, change date.</p>
  }
  var values = [], date=data.results[0].date;
  var tavg = null, tmin = null, tmax = null;
  data.results.map((val)=>{
    switch (val.datatype) {
      case 'TAVG':
        tavg = val.value;
        break;
      case 'TMIN':
        tmin = val.value;
        break;
      case 'TMAX':
        tmax = val.value;
        break;
      default:
        break;
    }
    if(val.date != date ){
      values.push({'date': val.date.substr(0,10), 'tavg':tavg, 'tmin':tmin, 'tmax':tmax})
      tavg = null, tmin = null, tmax = null, date = val.date;
    }
  })
  return (
    <div className="line-chart-wrapper">
      <LineChart
        width={900} height={400} data={values}
        margin={{ top: 40, right: 40, bottom: 20, left: 20 }}
      >
        <CartesianGrid vertical={true} />
        <XAxis dataKey="date"  />
        <YAxis domain={['auto', 'auto']}  />
        <Legend />
        <Line type="monotone" dataKey="tavg" stroke="#1D7373" dot={true} />
        <Line type="monotone" dataKey="tmin" stroke="#269926" dot={true} />
        <Line type="monotone" dataKey="tmax" stroke="#FFAA00" dot={true} />
      </LineChart>
    </div>
  )
};

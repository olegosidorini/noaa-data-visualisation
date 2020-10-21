import React, { useState, useEffect, useCallback } from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import {useData} from './components/hook.data';
import {DataDetail} from './components/module.data';

function App(props) {
  const [value, onChange] = useState([new Date(), new Date()]);
  const {loading, request} = useData();
  const [data, setData] = useState([])
  const fetchData = useCallback( async (id,val) => {
    const url = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&stationid='+id+'&units=metric&startdate='+val[0].toISOString()+'&enddate='+val[1].toISOString()+'&limit=99';
    const fetched = await request(url);
    setData(fetched);
  },[value,request]);
  useEffect(() => {fetchData(props.point.id,value)},[value, props.point.id]);
  
  return (
    <div className="Point">
      <h1>{props.point.name}</h1>
      <p>ID-{props.point.id}, mindate:{props.point.mindate}, maxdate:{props.point.maxdate}</p>
      <DateRangePicker  onChange={onChange}  value={value} />
      <hr/>
      {loading && <img src="https://cdn.dribbble.com/users/1260614/screenshots/4449732/dog-time400.gif"/>}
      {!loading && data && <DataDetail data={data}/>}
    </div>
  )
}



export default App;
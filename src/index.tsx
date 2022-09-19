import React, { useState } from "react";
import { render } from "react-dom";
import Plot from 'react-plotly.js';

import './index.css';


const LabelList = (num: Number) => {
  let a = new Array(num).fill(1).map((n:any, i:any) => n + i);
  let b = a.map(i => {
    return a.map(j => {
      return 'S' + String(j) + String(i)
    })
  });

  return ([] as string[]).concat(...b);
}

const colors = ['green', 'blue', 'red', 'orange']


const PlotComponent = (props: any) => {
  let labels = LabelList(props.port_n);

  let a = new Array(props.port_n*props.port_n).fill(0).map((n,i) => (n + i));

  let plot_data = [] as any[];
  a.map((i) => {
    let prop = {
      x: props.data[0],
      y: props.data[i*2+1],
      type: 'scatter',
      mode: 'lines',
      marker: { color: colors[i] },
      name: labels[i]
    }
    plot_data = [...plot_data, prop];
  });

  return (
    <div>
      <Plot
      data={plot_data}
      layout={{ 
        width: 750, 
        height: 500, 
        title: props.param + ' parameter',
        xaxis:{title:'Frequency (' + props.unit + ')', showgrid:true, zeroline:false, showline:true, showspikes:true},
        yaxis:{title:'Magnitude (dB)', showgrid:true, zeroline:false, showline:true},
        showlegend:true,
      }}
      />
    </div>
  );
};

const convert2DB = (form:string, array:any[]) => {
  let n = (array[0].length-2)/2;
  let m = Array(n).fill(1).map((n,i) => n+i*2);

  if (form === 'RI'){
    return array.map((j) => {
      m.map((k) => {
        let mag   = Math.sqrt(j[k]*j[k] + j[k+1]*j[k+1] )
        let angle = Math.atan2(j[k+1], j[k])
        j[k]   = 20 * Math.log10(mag)
        j[k+1] = angle * 180 / Math.PI
      })
      return j;
    });
  }

  return array
}

const App = () => {
  const [port_n, setPortN] = useState(2)
  const [unit,   setUnit ] = useState('GHz')
  const [param,  setParam] = useState('S')
  const [form,   setForm ] = useState('DB')
  const [R,      setR    ] = useState(50)
  const [data,   setData ] = useState([] as any[])
  
  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;

    let reader = new FileReader();
    let file = event.target.files[0];

    let format = '';
    let funit  = '';

    reader.onload = () => {
      let array = new Array();
      let a = reader.result?.toString().split('\n');

      a?.map((s) => {
        if (s[0] === '#'){
          let p = s.split(' ').filter(String)
          setUnit(p[1])
          setParam(p[2])
          setForm(p[3])
          setR(Number(p[5]))
          
          funit  = p[1]
          format = p[3]
        } 
        else if (s[0] !== '!' ){
          if (s.split(' ').filter(String).length >= 2){
            let a =s.split(' ').filter(String).map(i=>Number(i));
            if (a.length === 0) return;
            array = [...array, a]
          }
        }

        return s
      })
      
      // convert fromat RI to DB
      array = convert2DB(format, array);

      
      // tanspose 2D array
      array = array[0].map((col:any, i:any) => array.map(row => row[i]));
      
      // convert Frequency unit to GHz
      if (funit === 'HZ'){
        console.log(array)
        array[0] = array[0].map((f:number) => f/1e9)
        setUnit('GHz')
      } else if (funit === 'GHZ'){
        setUnit('GHz');
      }
      
      setData(array);

      setPortN(Math.sqrt((Number(array.length)-2)/2))

    }

    reader.readAsText(file)

  };

  return (
    <div>
      <h1 className="center"> Touch Stone File Viewer </h1>
      <input type="file" accept=".s*p" onChange={onFileInputChange} />
      <ul>
        <li>port number    : {port_n}</li>
        <li>frequency unit : {unit}</li>
        <li>parameter type : {param}</li>
        <li>format         : {form}</li>
        <li>port resistance: {R}</li>
      </ul>
      <div className="center">
        <PlotComponent port_n={port_n} param={param} unit={unit} data={data} />
      </div>
    </div>
  );
}

render(<App />, document.getElementById("root"));



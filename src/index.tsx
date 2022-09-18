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

const colors = ['red', 'blue', 'green', 'orange']

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

      // tanspose 2D array
      array = array[0].map((col:any, i:any) => array.map(row => row[i]));
      setData(array);

      setPortN(Math.sqrt((Number(array.length)-2)/2))

    }

    reader.readAsText(file)

  };

  return (
    <div>
      <input type="file" accept=".s*p" onChange={onFileInputChange} />
      <ul>
        <li>port number    : {port_n}</li>
        <li>frequency unit : {unit}</li>
        <li>parameter type : {param}</li>
        <li>format         : {form}</li>
        <li>port resistance: {R}</li>
      </ul>
      <PlotComponent port_n={port_n} param={param} unit={unit} data={data} />
    </div>
  );
}

render(<App />, document.getElementById("root"));



import React, { useState } from "react";
import { render } from "react-dom";
import './index.css';

const App = () => {
  const [unit,  setUnit ] = useState('GHz')
  const [param, setParam] = useState('S')
  const [form,  setForm ] = useState('DB')
  const [R,     setR    ] = useState(50)

  const [result, setResult] = useState()
  
  
  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let reader = new FileReader();
    let file = event.target.files[0];
    let data = new Array();
    
    reader.onload = () => {
      data = new Array();
      let a = reader.result?.toString().split('\n');

      a?.map((s) => {
        if (s[0] === '#'){
          let p = s.split(' ').filter(String)
          setUnit(p[1])
          setParam(p[2])
          setForm(p[3])
          setR(Number(p[5]))
        } 

        if (s[0] !== '!'){
          data = [...data, s.split(' ').filter(String).map(i=>Number(i))]
        }

        return s
      })

      console.log(data)

      setResult(reader.result?.toString().split('\n'));

    }

    reader.readAsText(file)
  };

  return (
    <div>
      <ul>
        <li>frequency unit : {unit}</li>
        <li>parameter type : {param}</li>
        <li>format         : {form}</li>
        <li>port resistance: {R}</li>
      </ul>
      <input type="file" accept=".s*p" onChange={onFileInputChange} />
      <p>{result}</p>
    </div>
  );
}

render(<App />, document.getElementById("root"));



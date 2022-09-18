import React, { useState } from "react";
import { render } from "react-dom";
import './index.css';

const App = () => {
  const [unit,  setUnit ] = useState('GHz')
  const [param, setParam] = useState('S')
  const [form,  setForm ] = useState('DB')
  const [R,     setR    ] = useState(50)
  
  
  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;

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
        else if (s[0] !== '!'){
          if (s.split(' ').filter(String).length !== 0)
            data = [...data, s.split(' ').filter(String).map(i=>Number(i))]
        }

        return s
      })

      console.log(data);

      // setResult(reader.result?.toString().split('\n'));

    }

    reader.readAsText(file)
  };

  return (
    <div>
      <input type="file" accept=".s*p" onChange={onFileInputChange} />
      <ul>
        <li>frequency unit : {unit}</li>
        <li>parameter type : {param}</li>
        <li>format         : {form}</li>
        <li>port resistance: {R}</li>
      </ul>
    </div>
  );
}

render(<App />, document.getElementById("root"));



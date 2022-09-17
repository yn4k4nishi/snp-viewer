import React, { Component, useState } from "react";
import { render } from "react-dom";
import './index.css';

const App = () => {
  const [result, setResult] = useState()

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let reader = new FileReader();
    let file = event.target.files[0];
    
    reader.onload = () => {
      console.log(reader.result?.toString().split('\n'))

      setResult(reader.result?.toString().split('\n'))
    }

    reader.readAsText(file)
  };

  return (
    <div>
      <input type="file" accept=".s*p" onChange={onFileInputChange} />
      <p>{result}</p>
    </div>
  );
}

render(<App />, document.getElementById("root"));



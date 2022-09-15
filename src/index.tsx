import React, { Component, useState } from "react";
import { render } from "react-dom";
import './index.css';

const App = () => {
  const [files, setFiles] = useState<File[]>([]);

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles([...files, ...event.target.files]);
  };

  return (
    <div>
      <input type="file" accept=".s*p" onChange={onFileInputChange} />
      <table>
        <tbody>
            {files.map(file => (
              <tr>
                <td>{file.name}</td>
                <td>{file.type}</td>
                <td>{file.size}</td>
                <td>{file.lastModified}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

render(<App />, document.getElementById("root"));



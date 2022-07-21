import React, { useState, useEffect } from "react";
import { StoreContext } from "./context.js";
import Highlight from "./components/Highlight";
import PattenSelector from "./components/PattenSelector";
// import * as child from 'child_process';
function App() {
  const [highlight, setHighlight] = useState("");
  const [text, setText] = useState([]);
  const [json, setJson] = useState([]);
  const [data, setData] = useState([]);
  const [python, setPython] = useState("");

  const format = (test) => {
    console.log(test);
    let lines = test.map((item) => item.lineNum);

    let uniqueLines = [...new Set(lines)];

    let newTest = [];
    uniqueLines.forEach((item) => {
      newTest.push({
        lineNum: item,
        selections: [],
      });
    });

    test.forEach((item) => {
      newTest.forEach((ele) => {
        if (item.lineNum === ele.lineNum) {
          ele.selections.push(item.selections);
        }
      });
    });

    newTest.forEach((items) => {
      let newItem = items.selections.flat(2);
      items.selections = newItem;
    });
    setJson(JSON.stringify(newTest));
    exportData(newTest);
  };
  const exportData = (newData) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(newData)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "sample.json";

    link.click();
  };
  const handleChange = (e) => {
    console.log(e.target.value)
    const { value } = e.target;
    let splitArray = value.split("\n");
    setText(splitArray);
  };
 const showFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target.result)
      console.log(text)
      setPython(text)
      // alert(text)
      // child.exec("javac /Users/hoangminh/Downloads/parser/App.java")
    };
    reader.readAsText(e.target.files[0])
  }
  return (
    <StoreContext.Provider value={{ data, setData, json, setJson }}>
      <div
        className="wrapper"
        style={{ display: "flex", alignItems: "center" }}
      >
        <div className="content-left" style={{ width: "50%" }}>
          <h3>Text input</h3>
          <textarea
            rows="10"
            onChange={(e) => handleChange(e)}
            style={{ width: "100%", height: "300px" }}
          ></textarea>
          <PattenSelector text={text} />
        </div>

        {/* <input
        type="text"
        onChange={(e) => {
          handleChange(e);
        }}
      /> */}
        <div className="export" style={{ padding: "0 20px" }}>
          <button onClick={() => format(data)}>Export</button>
          <input type="file" onChange={(e) => showFile(e)} />
        </div>
        <div classname="content-right" style={{ width: "50%" }}>
          <Highlight json={json} python={python} />
        </div>
      </div>
    </StoreContext.Provider>
  );
}

export default App;

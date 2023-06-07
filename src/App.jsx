import { useState, useCallback } from "react";
import "./App.css";
import LeftSide from "./components/LeftSide";
import RightSide from "./components/RightSide";

function App() {
  const [colorValue, setColorValue] = useState("crimson");
  const colorChanger = useCallback(
    (value) => {
      setColorValue(value);
    },
    [colorValue]
  );

  return (
    <>
      <div className="buckle color-container">
        <LeftSide colorValue={colorValue} setColorValue={colorChanger} />
        <RightSide colorValue={colorValue} setColorValue={colorChanger} />
      </div>
    </>
  );
}

export default App;

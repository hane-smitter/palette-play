import { useState, useCallback, useLayoutEffect } from "react";
import Typography from "@mui/material/Typography";

import "./App.css";
import LeftSide from "./components/LeftSide";
import RightSide from "./components/RightSide";
import BgColorPicker from "./components/BgColorChanger";

let rightSideKey = 1;

function App() {
  const [colorValue, setColorValue] = useState("#DC143C");
  const [changeBg, setChangeBg] = useState(false);
  const [bgDefaultValue, setBgDefaultValue] = useState(
    () => JSON.parse(localStorage.getItem("bgDefault")) || "#242424"
  );

  const colorChanger = useCallback(
    (value) => {
      setColorValue(value);
    },
    [colorValue]
  );
  const newColorPalette = useCallback(
    (value) => {
      setColorValue(value);
      rightSideKey++;
    },
    [colorValue]
  );

  useLayoutEffect(() => {
    const storedBgColor = JSON.parse(localStorage.getItem("bgDefault"));
    if (storedBgColor) {
      document.body.style.backgroundColor = storedBgColor;
    }
  }, []);

  function handleChangeBg(event) {
    const val = event?.target?.value;
    setBgDefaultValue(val);
    localStorage.setItem("bgDefault", JSON.stringify(val));
    document.body.style.backgroundColor = val;
  }

  return (
    <>
      {!changeBg ? (
        <Typography
          variant="h4"
          component="h1"
          style={{
            mixBlendMode: "difference",
            textDecoration: "underline",
            cursor: "pointer",
            marginBottom: "20px",
          }}
          className="contrast"
          onClick={() => setChangeBg(true)}
        >
          Change background color?
        </Typography>
      ) : (
        <BgColorPicker
          setChangeBg={setChangeBg}
          handleChangeBg={handleChangeBg}
          bgDefaultValue={bgDefaultValue}
        />
      )}

      <div className="buckle color-container">
        <LeftSide colorValue={colorValue} setColorValue={newColorPalette} />
        <RightSide
          colorValue={colorValue}
          setColorValue={colorChanger}
          key={rightSideKey}
        />
      </div>

      <footer
        style={{
          marginTop: "20px",
          backgroundColor: "#8b939a",
          padding: "2rem 0",
        }}
      >
        Made by <a href="https://twitter.com/smitterhane">@smittehane</a>
      </footer>
    </>
  );
}

export default App;

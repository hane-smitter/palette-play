import { useState, useRef } from "react";
import { alpha, darken, lighten } from "@mui/material/styles";

const RightSide = ({ colorValue, setColorValue }) => {
  const txtDisplay = useRef(null);
  const [rangeVal, setRangeVal] = useState(0);
  const [manipulation, setManipulation] = useState("darken");
  const colorFunctions = {
    alpha,
    darken,
    lighten,
  };

  function handleColorChange(event) {
    setRangeVal(event.target.value);
    txtDisplay.current && (txtDisplay.current.innerText = event.target.value);
  }

  function handleRadioChange(event) {
    setManipulation(event.target?.value);
    // console.log("value:  ", event.target?.value);
  }

  function processColor(colorManipulator) {
    return colorFunctions[colorManipulator](colorValue, rangeVal);
  }

  return (
    <div>
      <div className="color-input-box">
        <div className="radio-btns" style={{ width: "100%" }}>
          <input
            type="radio"
            name="manipulationMode"
            id="manipulationChoice1"
            value="darken"
            onChange={handleRadioChange}
            checked={Object.is(manipulation, "darken")}
          />
          <label htmlFor="manipulationChoice1" className="contrast">
            Blacken
          </label>

          <input
            type="radio"
            name="manipulationMode"
            id="manipulationChoice2"
            value="lighten"
            onChange={handleRadioChange}
            checked={Object.is(manipulation, "lighten")}
          />
          <label htmlFor="manipulationChoice2" className="contrast">
            Whiten
          </label>

          <input
            type="radio"
            name="manipulationMode"
            id="manipulationChoice3"
            value="alpha"
            onChange={handleRadioChange}
            checked={Object.is(manipulation, "alpha")}
          />
          <label htmlFor="manipulationChoice3" className="contrast">
            Alpha
          </label>
        </div>

        <label htmlFor="color" className="contrast">
          Slide:&nbsp;&nbsp;&nbsp;
        </label>
        <input
          type="range"
          name="color-range"
          id="color"
          min={0}
          max={1}
          step={0.01}
          value={rangeVal}
          onChange={handleColorChange}
        />
      </div>
      <div className="color-result-box">
        <div
          className="color-result buckle"
          style={{ backgroundColor: `${processColor(manipulation)}` }}
        >
          <p>{processColor(manipulation)}</p>
        </div>
        <p style={{ width: "100%" }} className="contrast">
          Degree:{" "}
          <span
            ref={txtDisplay}
            style={{ width: "3ch", display: "inline-block" }}
          >
            {rangeVal}
          </span>
        </p>
        <p style={{ color: `${processColor(manipulation)}` }}>
          Sample text with chosen color displayed here
        </p>
      </div>
    </div>
  );
};

export default RightSide;

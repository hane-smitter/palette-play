import { useState, useRef } from "react";

const RightSide = ({ colorValue, setColorValue }) => {
  const txtDisplay = useRef(null);
  const [rangeVal, setRangeVal] = useState(0);

  function handleColorChange(event) {
    setRangeVal(event.target.value);
    txtDisplay.current && (txtDisplay.current.innerText = event.target.value);
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
          />
          <label for="manipulationChoice1">Darken</label>
          <input
            type="radio"
            name="manipulationMode"
            id="manipulationChoice2"
            value="lighten"
          />
          <label for="manipulationChoice2">Lighten</label>
        </div>
        <label for="color">Slide:&nbsp;&nbsp;&nbsp;</label>
        <br />
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
          className="color-result"
          style={{ backgroundColor: `${colorValue}` }}
        ></div>
        <p style={{ width: "100%" }}>
          Range value is:{" "}
          <span
            ref={txtDisplay}
            style={{ width: "3ch", display: "inline-block" }}
          >
            {rangeVal}
          </span>
        </p>
      </div>
    </div>
  );
};

export default RightSide;

import { useState } from "react";

const LeftSide = ({ colorValue, setColorValue }) => {
  const [colorInput, setcolorInput] = useState(colorValue);

  function handleColorChange(event) {
    setcolorInput(event.target.value);
  }

  function handleColorSubmit(event) {
    event.preventDefault();
    // console.log(event.target["color-value"].value);
    setColorValue(event.target["color-value"].value);
  }

  return (
    <div>
      <div className="color-input-box">
        <label htmlFor="color-val" className="contrast">
          Enter a color:&nbsp;&nbsp;&nbsp;
        </label>
        <br />
        <form onSubmit={handleColorSubmit}>
          <input
            // type="color"
            name="color-value"
            id="color-val"
            value={colorInput}
            onChange={handleColorChange}
          />
          <button type="submit" className="btn">Enter</button>
        </form>
      </div>
      <div className="color-result-box">
        <div
          className="color-result buckle"
          style={{ backgroundColor: `${colorValue}` }}
        ></div>
      </div>
    </div>
  );
};

export default LeftSide;

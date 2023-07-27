import { useState } from "react";
import Color from "color";

const LeftSide = ({ colorValue, setColorValue }) => {
  let color;
  try {
    color = new Color(colorValue);
  } catch (error) {
    color = new Color("#DC143C");
  }
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
        <label htmlFor="color-val">Enter a color:&nbsp;&nbsp;&nbsp;</label>
        <br />
        <form onSubmit={handleColorSubmit}>
          <input
            // type="color"
            name="color-value"
            id="color-val"
            value={colorInput}
            onChange={handleColorChange}
          />
          <button type="submit" className="btn">
            Enter
          </button>
        </form>
      </div>
      <div className="color-result-box">
        <div
          className="color-result buckle"
          style={{ backgroundColor: `${color.rgb().string()}` }}
        ></div>
      </div>
    </div>
  );
};

export default LeftSide;

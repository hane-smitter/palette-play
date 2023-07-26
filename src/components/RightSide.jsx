import { useState, useRef, useCallback, memo } from "react";
import Color from "color";

import Mixers from "./mixers/Mixers";

const RightSide = ({ colorValue, setColorValue }) => {
  const [, triggerRender] = useState(false);
  const [colorDisplayFormat, setColorDisplayFormat] = useState("hsl");

  let color;
  try {
    color = new Color(colorValue);
  } catch (error) {
    color = new Color("#DC143C");
  }

  const manipulatedColor = useRef(color);
  let colorInView;

  switch (colorDisplayFormat) {
    case "hex":
      colorInView = manipulatedColor.current.hex();
      break;
    case "rgb":
      colorInView = manipulatedColor.current.rgb().string(2);
      break;
    case "hsl":
      colorInView = manipulatedColor.current.hsl().string(2);
      break;

    default:
      colorInView = manipulatedColor.current.hsl().string(2);
  }

  const colorDisplay = useCallback(
    ({ hue, saturation, lightness }) => {
      manipulatedColor.current = Color({
        h: hue,
        s: saturation,
        l: lightness,
      });
      triggerRender((prev) => !prev);
    },
    [colorValue]
  );
  const setColorFormat = useCallback((format) => {
    setColorDisplayFormat(format);
  });

  return (
    <div>
      <div className="color-input-box">
        <Mixers colorValue={colorValue} colorDisplay={colorDisplay} />
      </div>
      <FormatSelection
        setColorFormat={setColorFormat}
        colorFormat={colorDisplayFormat}
      />
      <div className="color-result-box">
        <div
          className="color-result buckle"
          style={{
            backgroundColor: `${colorInView}`,
            resize: "horizontal",
            overflow: "hidden",
          }}
        >
          <div className="color-result-text-bg">
            <p className="color-result-text">{colorInView}</p>
          </div>
        </div>
        <p style={{ color: `${colorInView}`, width: "100%" }}>
          Sample text with chosen color displayed here
        </p>
      </div>
    </div>
  );
};

function FormatSelection({ setColorFormat, colorFormat }) {
  const [selectedFormat, setSelectedFormat] = useState(colorFormat);

  return (
    <div>
      <label htmlFor="color-format" style={{ marginRight: 8 }}>
        Change format:
      </label>
      <select
        id="color-format"
        onChange={(e) => {
          setSelectedFormat(e.target.value);
          setColorFormat(e.target.value);
        }}
        value={selectedFormat}
      >
        <option value="rgb">rgb</option>
        <option value="hsl">hsl</option>
        <option value="hex">hex</option>
      </select>
    </div>
  );
}

export default memo(RightSide);

import { useState, useRef, useCallback } from "react";
import Color from "color";
import Mixers from "./Mixers";

const RightSide = ({ colorValue, setColorValue }) => {
  const [, triggerRender] = useState(false);
  const manipulatedColor = useRef(Color(colorValue).hsl().string());

  const colorUpdater = useCallback((color) => {
    manipulatedColor.current = color;
    triggerRender((prev) => !prev);
  }, []);

  return (
    <div>
      <div className="color-input-box">
        <Mixers colorValue={colorValue} colorUpdater={colorUpdater} />
      </div>
      <div className="color-result-box">
        <div
          className="color-result buckle"
          style={{
            backgroundColor: `${manipulatedColor.current}`,
            resize: "horizontal",
            overflow: "hidden",
          }}
        >
          <p>{manipulatedColor.current}</p>
        </div>
        {/* <p style={{ width: "100%" }} className="contrast">
          Degree:{" "}
          <span
            // ref={displayRange}
            style={{ width: "3ch", display: "inline-block" }}
          >
            {rangeValue}
          </span>
        </p> */}
        <p style={{ color: `${manipulatedColor.current}` }}>
          Sample text with chosen color displayed here
        </p>
      </div>
    </div>
  );
};

export default RightSide;

import React, { useState, useRef } from "react";
import Color from "color";

function Mixers({ colorValue, colorUpdater }) {
  const color = new Color(colorValue);

  const colorTransform = useRef(color);
  const colorHSL = useRef(color.hsl());
  const [hueSliderVal, setHueSliderVal] = useState(0);
  const [saturationRatio, setSaturationRatio] = useState(0);
  const [lightnessRatio, setLightnessRatio] = useState(0);

  function handleHueChange(event, direction) {
    const newValue = event.target.value;
    const newColorDiff = colorTransform.current.rotate(newValue);
    colorTransform.current = newColorDiff;

    colorHSL.current = newColorDiff.hsl();
    colorUpdater(newColorDiff.hsl().string());

    setHueSliderVal(newValue);

    // console.log("hue Slider:: %d, color: %s ", newValue, colorValue);
    console.log(newColorDiff.hsl());
  }
  function handleSaturationChange(event, direction) {
    if (direction == "plus") {
      let newValue = Math.min(
        Math.round((saturationRatio + 1 / 10) * 10) / 10,
        1
      );

      const newColorDiff = colorTransform.current.saturate(newValue);
      colorTransform.current = newColorDiff;

      colorHSL.current = newColorDiff.hsl();
      colorUpdater(newColorDiff.hsl().string());
      setSaturationRatio(newValue);
    } else {
      let newValue = Math.max(
        Math.round((saturationRatio - 1 / 10) * 10) / 10,
        0
      );

      const newColorDiff = colorTransform.current.saturate(newValue);
      colorHSL.current = newColorDiff.hsl();
      colorUpdater(newColorDiff.hsl().string());
      setSaturationRatio(newValue);

      setSaturationRatio(newValue);
    }
  }
  function handleLightnessChange(event, direction) {
    if (direction == "plus") {
      setLightnessRatio((prev) =>
        Math.min(Math.round((prev + 1 / 10) * 10) / 10, 1)
      );
    } else {
      setLightnessRatio((prev) =>
        Math.max(Math.round((prev - 1 / 10) * 10) / 10, 0)
      );
    }
  }

  return (
    <>
      <div className="mixer-btns" style={{ width: "100%" }}>
        <table>
          <caption>Modify Colors</caption>
          <thead>
            <tr>
              <th scope="col">Setting</th>
              <th scope="col">Value</th>
              <th scope="col">result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Hue</th>
              <td>
                <span>
                  <input
                    type="range"
                    value={hueSliderVal}
                    min={0}
                    max={360}
                    step={1}
                    onChange={(e) => handleHueChange(e, "minus")}
                  />
                  <span style={{ fontWeight: 600 }}>&nbsp;{hueSliderVal}</span>
                </span>
              </td>
              <td>
                <span style={{ fontWeight: 600 }}>
                  &nbsp;{colorHSL.current?.color[0]}
                </span>
              </td>
            </tr>
            <tr>
              <th scope="row">Saturation</th>
              <td>
                <span>
                  <button
                    className="btn"
                    onClick={(e) => handleSaturationChange(e, "minus")}
                    disabled={saturationRatio == 0}
                  >
                    -
                  </button>
                  &nbsp;
                  <span
                    style={{
                      width: "3ch",
                      display: "inline-block",
                      textAlign: "center",
                    }}
                  >
                    {saturationRatio}
                  </span>
                  &nbsp;
                  <button
                    className="btn"
                    onClick={(e) => handleSaturationChange(e, "plus")}
                    disabled={saturationRatio == 1}
                  >
                    +
                  </button>
                </span>
              </td>
              <td>
                <span style={{ fontWeight: 600 }}>
                  &nbsp;{Math.round(colorHSL.current?.color[1] * 100) / 100}
                </span>
              </td>
            </tr>
            <tr>
              <th scope="row">Lightness</th>
              <td>
                <span>
                  <button
                    className="btn"
                    onClick={(e) => handleLightnessChange(e, "minus")}
                    disabled={lightnessRatio == 0}
                  >
                    -
                  </button>
                  &nbsp;
                  <span
                    style={{
                      width: "3ch",
                      display: "inline-block",
                      textAlign: "center",
                    }}
                  >
                    {lightnessRatio}
                  </span>
                  &nbsp;
                  <button
                    className="btn"
                    onClick={(e) => handleLightnessChange(e, "plus")}
                    disabled={lightnessRatio == 1}
                  >
                    +
                  </button>
                </span>
              </td>
              <td>
                <span style={{ fontWeight: 600 }}>
                  &nbsp;{Math.round(colorHSL.current?.color[2] * 100) / 100}
                </span>
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <th scope="row">Code</th>
              <td colSpan="2">...coming soon...</td>
            </tr>
          </tfoot>
        </table>

        {/* <div className="row">
          <span>Hue: </span>
          <span>
            <input
              type="range"
              value={hueSliderVal}
              min={0}
              max={360}
              step={1}
              onChange={(e) => handleHueChange(e, "minus")}
            />
            <span style={{ fontWeight: 600 }}>&nbsp;{colorHSL.current}</span>
          </span>
        </div>
        <div className="row">
          <span>Saturation: </span>
          <span>
            <button
              className="btn"
              onClick={(e) => handleSaturationChange(e, "minus")}
              disabled={saturationRatio == 0}
            >
              -
            </button>
            &nbsp;
            <span
              style={{
                width: "3ch",
                display: "inline-block",
                textAlign: "center",
              }}
            >
              {saturationRatio}
            </span>
            &nbsp;
            <button
              className="btn"
              onClick={(e) => handleSaturationChange(e, "plus")}
              disabled={saturationRatio == 1}
            >
              +
            </button>
          </span>
        </div>
        <div className="row">
          <span>Lightness: </span>
          <span>
            <button
              className="btn"
              onClick={(e) => handleLightnessChange(e, "minus")}
              disabled={lightnessRatio == 0}
            >
              -
            </button>
            &nbsp;
            <span
              style={{
                width: "3ch",
                display: "inline-block",
                textAlign: "center",
              }}
            >
              {lightnessRatio}
            </span>
            &nbsp;
            <button
              className="btn"
              onClick={(e) => handleLightnessChange(e, "plus")}
              disabled={lightnessRatio == 1}
            >
              +
            </button>
          </span>
        </div> */}
      </div>
    </>
  );
}

export default React.memo(Mixers);

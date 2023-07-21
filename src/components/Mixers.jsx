import React, { useState, useRef } from "react";
import Color from "color";

function Mixers({ colorValue, colorUpdater }) {
  const color = new Color(colorValue);

  const [, triggerRender] = useState(false); // To be used when we need to trigger rerender manually
  const colorTransform = useRef(color);
  const colorHSL = useRef(color.hsl());
  const [hueSliderVal, setHueSliderVal] = useState(0);
  const saturationRatio = useRef(0.1);
  const lightnessRatio = useRef(0.1);

  const codeHue =
    Math.round(
      (colorHSL.current?.color[0] - Color(colorValue).hsl()?.color[0]) * 1000
    ) / 1000;

  const saturationResult = Math.round(colorHSL.current?.color[1] * 10) / 10;
  const saturation1 = colorHSL.current?.color[1];
  const saturation2 = Color(colorValue).hsl()?.color[1];
  const codeSaturation = Math.abs(
    Math.round(((saturation1 - saturation2) / saturation2) * 1000) / 1000
  );
  const lightnessResult = Math.round(colorHSL.current?.color[2] * 10) / 10;
  const lightness1 = colorHSL.current?.color[2];
  const lightness2 = Color(colorValue).hsl()?.color[2];
  const codeLightness = Math.abs(
    Math.round(((lightness1 - lightness2) / lightness2) * 1000) / 1000
  );

  function handleHueChange(event, direction) {
    const newValue = event.target.value;
    const newColorDiff = colorTransform.current.rotate(newValue);
    colorTransform.current = newColorDiff;

    colorHSL.current = newColorDiff.hsl();
    colorUpdater(newColorDiff.hsl().string());

    setHueSliderVal(newValue);
  }

  function handleSaturationChange(event, direction) {
    const ratio = saturationRatio.current;

    if (direction == "plus") {
      var newColorDiff = colorTransform.current.saturate(ratio);
    } else {
      var newColorDiff = colorTransform.current.desaturate(ratio);
    }

    colorTransform.current = newColorDiff;

    colorHSL.current = newColorDiff.hsl();
    colorUpdater(newColorDiff.hsl().string());

    triggerRender((prev) => !prev); // To update UI
  }

  function handleLightnessChange(event, direction) {
    const ratio = lightnessRatio.current;

    if (direction == "plus") {
      var newColorDiff = colorTransform.current.lighten(ratio);
    } else {
      var newColorDiff = colorTransform.current.darken(ratio);
    }

    colorTransform.current = newColorDiff;

    colorHSL.current = newColorDiff.hsl();
    colorUpdater(newColorDiff.hsl().string());

    triggerRender((prev) => !prev); // To update UI
  }

  return (
    <>
      <div className="mixer-btns" style={{ width: "100%" }}>
        <table>
          <caption>Manipulate color</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Control</th>
              <th scope="col">Result</th>
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
                  <span
                    style={{
                      fontWeight: 400,
                      display: "block",
                      lineHeight: "1",
                    }}
                  >
                    &nbsp;{hueSliderVal}
                  </span>
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
                    disabled={saturationResult <= 0}
                  >
                    -
                  </button>
                  &nbsp;
                  <span
                    style={{
                      display: "inline-block",
                      textAlign: "center",
                    }}
                  >
                    <span className="adjust-ratio">Adjusts by ratio:</span>
                    {saturationRatio.current}
                  </span>
                  &nbsp;
                  <button
                    className="btn"
                    onClick={(e) => handleSaturationChange(e, "plus")}
                    disabled={saturationResult >= 100}
                  >
                    +
                  </button>
                </span>
              </td>
              <td>
                <span style={{ fontWeight: 600 }}>
                  &nbsp;{saturationResult}
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
                    disabled={lightnessResult <= 0}
                  >
                    -
                  </button>
                  &nbsp;
                  <span
                    style={{
                      display: "inline-block",
                      textAlign: "center",
                    }}
                  >
                    <span className="adjust-ratio">Adjusts by ratio:</span>
                    {lightnessRatio.current}
                  </span>
                  &nbsp;
                  <button
                    className="btn"
                    onClick={(e) => handleLightnessChange(e, "plus")}
                    disabled={lightnessResult >= 100}
                  >
                    +
                  </button>
                </span>
              </td>
              <td>
                <span style={{ fontWeight: 600 }}>&nbsp;{lightnessResult}</span>
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <th scope="row">
                <a
                  href="https://www.npmjs.com/package/color"
                  title="Library specific code to generate this color"
                >
                  Code
                </a>
              </th>
              <td colSpan="2">
                <span className="generative-code">
                  {`color.hue(${codeHue})`}
                  <wbr />
                  {`.${
                    colorHSL.current?.color[1] >=
                    Color(colorValue).hsl()?.color[1]
                      ? "saturate"
                      : "desaturate"
                  }(${codeSaturation})`}
                  <wbr />
                  {`.${
                    colorHSL.current?.color[2] >=
                    Color(colorValue).hsl()?.color[2]
                      ? "lighten"
                      : "darken"
                  }(${codeLightness})`}
                </span>
              </td>
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
              disabled={saturationRatio.current == 0}
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
              {saturationRatio.current}
            </span>
            &nbsp;
            <button
              className="btn"
              onClick={(e) => handleSaturationChange(e, "plus")}
              disabled={saturationRatio.current == 1}
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

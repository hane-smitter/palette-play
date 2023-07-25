import React, { useState, useRef, useEffect, useCallback } from "react";
import Color from "color";
import ResultInput from "./ResultInput";

function Mixers({ colorValue, colorUpdater }) {
  let color;
  try {
    color = new Color(colorValue);
  } catch (error) {
    color = new Color("#DC143C");
  }
  // console.log(
  //   "Math.round(color.hsl()?.color[0]: ",
  //   Math.round(color.hsl()?.color[0])
  // );

  const [, triggerRender] = useState(false); // To be used when we need to trigger rerender manually
  const colorTransform = useRef(color);
  const colorHSL = useRef(color.hsl());
  const [hueSliderVal, setHueSliderVal] = useState(
    Math.round(color.hsl()?.color[0])
  );
  const saturationRatio = useRef(0.1);
  const lightnessRatio = useRef(0.1);

  // const hueResult = Math.round(colorHSL.current?.color[0] * 100) / 100;
  const hueResult = colorHSL.current?.color[0];
  const codeHue =
    Math.round((colorHSL.current?.color[0] - color.hsl()?.color[0]) * 1000) /
    1000;

  // const saturationResult = Math.round(colorHSL.current?.color[1] * 100) / 100;
  const saturationResult = colorHSL.current?.color[1];
  const saturation1 = colorHSL.current?.color[1];
  const saturation2 = color.hsl()?.color[1];
  const s_calc_divisor = saturation2 || 1; // To avoid Infinity result when saturation is 0
  const s_calculation = (saturation1 - saturation2) / s_calc_divisor;
  const codeSaturation = Math.abs(Math.round(s_calculation * 1000) / 1000);

  const lightnessResult = colorHSL.current?.color[2];
  const lightness1 = colorHSL.current?.color[2];
  const lightness2 = color.hsl()?.color[2];
  const l_calc_divisor = lightness2 || 1; // To avoid Infinity result when lightness is 0
  const l_calculation = (lightness1 - lightness2) / l_calc_divisor;
  const codeLightness = Math.abs(Math.round(l_calculation * 1000) / 1000);

  // useEffect(() => {
  //   // This effect serves to set initial value of slider from `hueResult`,
  //   // which overides what child(`ResultInput`) effect sets with improper number precision
  //   hueResultChange(hueResult);
  // }, []);

  function handleHueChange(inpValue) {
    const newValue = Number(inpValue);

    const newColorDiff = colorTransform.current.hue(newValue);
    colorTransform.current = newColorDiff;
    colorHSL.current = newColorDiff.hsl();
    colorUpdater({
      hue: newColorDiff.hsl()?.color[0], // BUG on late update when we use hueResult Variable
      saturation: newColorDiff.hsl()?.color[1],
      lightness: newColorDiff.hsl()?.color[2],
    });

    setHueSliderVal(newValue);
  }
  const hueResultChange = useCallback(function (resultValue) {
    const newValue = Number(resultValue);
    if (newValue < 0 || newValue > 360) return;

    const newColorDiff = colorTransform.current.hue(newValue);

    let hueSliderDiff = newColorDiff.hsl()?.color[0];

    /* This commented code applies if we `.rotate()` color to get an = representation on a slider */
    // let hueSliderDiff = newColorDiff.hsl()?.color[0] - color.hsl()?.color[0];
    // if (hueSliderDiff < 0 || hueSliderDiff > 360) {
    //   // To calculate modulous: ((n % d) + d) % d
    //   hueSliderDiff = ((hueSliderDiff % 360) + 360) % 360;
    // }

    const sliderValue = Math.round(hueSliderDiff);

    colorTransform.current = newColorDiff;
    colorHSL.current = newColorDiff.hsl();
    colorUpdater({
      hue: newColorDiff.hsl()?.color[0], // BUG on late update when we use hueResult Variable
      saturation: newColorDiff.hsl()?.color[1],
      lightness: newColorDiff.hsl()?.color[2],
    });

    setHueSliderVal(sliderValue);
    // Above Hue setState won't rerender UI if clicked button rounds off and arrives at initial color hue
    // So we ensure rerender is triggered to update the useRefs in the UI
    triggerRender((prev) => !prev);
  }, []);

  function handleSaturationChange(event, direction) {
    const ratio = saturationRatio.current;

    const currentLightness = colorTransform.current.hsl()?.color[1];
    var newColorDiff;
    if (currentLightness == 0) {
      newColorDiff = Color({
        h: colorTransform.current.hsl()?.color[0],
        s: 0.7,
        l: colorTransform.current.hsl()?.color[2],
      });
    } else {
      direction == "plus"
        ? (newColorDiff = colorTransform.current.saturate(ratio))
        : (newColorDiff = colorTransform.current.desaturate(ratio));
    }

    colorTransform.current = newColorDiff;
    colorHSL.current = newColorDiff.hsl();
    colorUpdater({
      hue: newColorDiff.hsl()?.color[0],
      saturation: newColorDiff.hsl()?.color[1], // `saturationResult` has late updates
      lightness: newColorDiff.hsl()?.color[2],
    });

    triggerRender((prev) => !prev); // To update UI
  }
  const saturationResultChange = useCallback(function (resultValue) {
    const newValue = Number(resultValue);
    if (newValue < 0 || newValue > 100) return;

    const newColorDiff = colorTransform.current.saturationl(newValue);

    colorTransform.current = newColorDiff;
    colorHSL.current = newColorDiff.hsl();
    colorUpdater({
      hue: newColorDiff.hsl()?.color[0],
      saturation: newColorDiff.hsl()?.color[1], // `saturationResult` has late updates
      lightness: newColorDiff.hsl()?.color[2],
    });

    triggerRender((prev) => !prev);
  }, []);

  function handleLightnessChange(event, direction) {
    const ratio = lightnessRatio.current;

    const currentLightness = colorTransform.current.hsl()?.color[2];
    var newColorDiff;
    if (currentLightness == 0) {
      newColorDiff = Color({
        h: colorTransform.current.hsl()?.color[0],
        s: colorTransform.current.hsl()?.color[1],
        l: 0.7,
      });
    } else {
      direction == "plus"
        ? (newColorDiff = colorTransform.current.lighten(ratio))
        : (newColorDiff = colorTransform.current.darken(ratio));
    }

    colorTransform.current = newColorDiff;
    colorHSL.current = newColorDiff.hsl();
    colorUpdater({
      hue: newColorDiff.hsl()?.color[0],
      saturation: newColorDiff.hsl()?.color[1],
      lightness: newColorDiff.hsl()?.color[2], // `lightnessResult` holds delayed updated value
    });

    triggerRender((prev) => !prev); // To update UI
  }
  function lightnessResultChange(resultValue) {
    const newValue = Number(resultValue);
    if (newValue < 0 || newValue > 100) return;

    const newColorDiff = colorTransform.current.lightness(newValue);

    colorTransform.current = newColorDiff;
    colorHSL.current = newColorDiff.hsl();
    colorUpdater({
      hue: newColorDiff.hsl()?.color[0],
      saturation: newColorDiff.hsl()?.color[1],
      lightness: newColorDiff.hsl()?.color[2],
    });

    triggerRender((prev) => !prev);
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
                    onChange={(e) => handleHueChange(e.target.value, "minus")}
                  />
                  <span
                    style={{
                      fontWeight: 400,
                      display: "block",
                      lineHeight: "1",
                    }}
                  >
                    <button
                      className="btn"
                      onClick={(e) =>
                        handleHueChange(
                          Number(hueSliderVal) - 1 > 0
                            ? Number(hueSliderVal) - 1
                            : 0,
                          "minus"
                        )
                      }
                      disabled={Number(hueSliderVal) <= 0}
                    >
                      -
                    </button>
                    &nbsp; &nbsp; &nbsp;
                    <span
                      style={{
                        width: "3ch",
                        textAlign: "center",
                        fontSize: "13px",
                      }}
                    >
                      {hueSliderVal}
                    </span>
                    &nbsp; &nbsp; &nbsp;
                    <button
                      className="btn"
                      onClick={(e) =>
                        handleHueChange(
                          Number(hueSliderVal) + 1 < 360
                            ? Number(hueSliderVal) + 1
                            : 360,
                          "plus"
                        )
                      }
                      disabled={Number(hueSliderVal) >= 360}
                    >
                      +
                    </button>
                  </span>
                </span>
              </td>
              <td style={{ position: "relative" }}>
                {Math.round(colorHSL.current?.color[0] * 100) / 100 !==
                  Math.round(color.hsl()?.color[0] * 100) / 100 && (
                  <button
                    className="btn restore-btn"
                    title="Restores to initial"
                    style={{ fontSize: "10px" }}
                    onClick={(e) => {
                      const hue = color.hsl()?.color[0]; // Not rounding
                      // console.log("hue restore : ", hue);
                      hueResultChange(hue);
                    }}
                  >
                    restore
                  </button>
                )}
                <span style={{ fontWeight: 600 }}>
                  <ResultInput
                    resultChange={hueResultChange}
                    resultValue={hueResult}
                    min={0}
                    max={360}
                  />
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
              <td style={{ position: "relative" }}>
                {Math.round(colorHSL.current?.color[1] * 100) / 100 !==
                  Math.round(color.hsl()?.color[1] * 100) / 100 && (
                  <button
                    className="btn restore-btn"
                    title="Restores to initial"
                    style={{ fontSize: "10px" }}
                    onClick={(e) => {
                      const saturation = color.hsl()?.color[1]; // Not rounding
                      saturationResultChange(saturation);
                    }}
                  >
                    restore
                  </button>
                )}
                <span style={{ fontWeight: 600 }}>
                  <ResultInput
                    resultChange={saturationResultChange}
                    resultValue={saturationResult}
                    min={0}
                    max={100}
                  />
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
              <td style={{ position: "relative" }}>
                {Math.round(colorHSL.current?.color[2] * 100) / 100 !==
                  Math.round(color.hsl()?.color[2] * 100) / 100 && (
                  <button
                    className="btn restore-btn"
                    title="Restores to initial"
                    style={{ fontSize: "10px" }}
                    onClick={(e) => {
                      const lightness = color.hsl()?.color[2]; // Not rounding off
                      lightnessResultChange(lightness);
                    }}
                  >
                    restore
                  </button>
                )}
                <span>
                  <ResultInput
                    resultChange={lightnessResultChange}
                    resultValue={lightnessResult}
                    min={0}
                    max={100}
                  />
                </span>
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
                  {`color.rotate(${codeHue})`}
                  <wbr />
                  {`.${
                    colorHSL.current?.color[1] >= color.hsl()?.color[1]
                      ? "saturate"
                      : "desaturate"
                  }(${codeSaturation})`}
                  <wbr />
                  {`.${
                    colorHSL.current?.color[2] >= color.hsl()?.color[2]
                      ? "lighten"
                      : "darken"
                  }(${codeLightness})`}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}

export default React.memo(Mixers);

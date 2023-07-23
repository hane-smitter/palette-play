import React, { useState, useRef, useEffect } from "react";
import Color from "color";

function Mixers({ colorValue, colorUpdater }) {
  const color = new Color(colorValue);

  // console.log({ color });

  const [, triggerRender] = useState(false); // To be used when we need to trigger rerender manually
  const colorTransform = useRef(color);
  const colorHSL = useRef(color.hsl());
  const [hueSliderVal, setHueSliderVal] = useState(0);
  const saturationRatio = useRef(0.1);
  const lightnessRatio = useRef(0.1);

  const hueResult = Math.round(colorHSL.current?.color[0] * 100) / 100;
  const codeHue =
    Math.round(
      (colorHSL.current?.color[0] - Color(colorValue).hsl()?.color[0]) * 1000
    ) / 1000;

  const saturationResult = Math.round(colorHSL.current?.color[1] * 10) / 10;
  const saturation1 = colorHSL.current?.color[1];
  const saturation2 = color.hsl()?.color[1];
  const s_calc_divisor = saturation2 || 1; // To avoid Infinity result when saturation is 0
  const s_calculation = (saturation1 - saturation2) / s_calc_divisor;
  const codeSaturation = Math.abs(Math.round(s_calculation * 1000) / 1000);
  // console.log(
  //   "codeSaturation %d:: S1:%d S2:%d",
  //   codeSaturation,
  //   saturation1,
  //   saturation2
  // );

  const lightnessResult = Math.round(colorHSL.current?.color[2] * 10) / 10;
  const lightness1 = colorHSL.current?.color[2];
  const lightness2 = color.hsl()?.color[2];
  const l_calc_divisor = lightness2 || 1; // To avoid Infinity result when lightness is 0
  const l_calculation = (lightness1 - lightness2) / l_calc_divisor;
  const codeLightness = Math.abs(Math.round(l_calculation * 1000) / 1000);

  // useEffect(() => {
  //   console.log("Colorvalue HAS CHANGED!!: ", color);
  //   colorTransform.current = color;
  //   colorHSL.current = color.hsl();

  //   colorUpdater({
  //     hue: Math.round(color.hsl()?.color[0] * 100) / 100,
  //     saturation: Math.round(color.hsl()?.color[1] * 10) / 10,
  //     lightness: Math.round(color.hsl()?.color[2] * 10) / 10,
  //   });

  //   setHueSliderVal(0);
  // }, [colorValue]);

  function handleHueChange(inpValue, absolute = false) {
    const newValue = Number(inpValue);

    const newColorDiff = colorTransform.current.rotate(newValue);
    console.log({ newColorDiff });
    colorTransform.current = newColorDiff;

    colorHSL.current = newColorDiff.hsl();
    // console.log("NEW Hue Diff color: ", newColorDiff.hsl());
    colorUpdater({
      hue: Math.round(newColorDiff.hsl()?.color[0] * 100) / 100, // BUG on late update when we use hueResult Variable
      saturation: saturationResult,
      lightness: lightnessResult,
    });

    // Math.round(colorHSL.current?.color[0] * 100) / 100

    setHueSliderVal(newValue);
  }

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
      hue: hueResult,
      saturation: Math.round(newColorDiff.hsl()?.color[1] * 10) / 10, // `saturationResult` has late updates
      lightness: lightnessResult,
    });

    triggerRender((prev) => !prev); // To update UI
  }

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
    console.log("colorHSL.current in btn click: ", colorHSL.current);
    colorUpdater({
      hue: hueResult,
      saturation: saturationResult,
      lightness: Math.round(newColorDiff.hsl()?.color[2] * 10) / 10, // `lightnessResult` holds delayed updated value
    });

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
                      disabled={hueSliderVal <= 0}
                    >
                      -
                    </button>
                    &nbsp; &nbsp; &nbsp;
                    {hueSliderVal}
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
                      disabled={hueSliderVal >= 360}
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
                    style={{ fontSize: "10px" }}
                    onClick={(e) => {
                      // colorHSL.current?.color[0] = color.hsl()?.color[0];
                      const hue = Math.round(color.hsl()?.color[0] * 100) / 100;
                      const restoreHue = [
                        hue,
                        colorHSL.current?.color[1],
                        colorHSL.current?.color[2],
                      ];

                      colorHSL.current = {
                        ...color.hsl(),
                        color: [...restoreHue],
                      };
                      colorTransform.current = Color({
                        h: restoreHue[0],
                        s: restoreHue[1],
                        l: restoreHue[2],
                      });

                      colorUpdater({
                        hue: restoreHue[0],
                        saturation: restoreHue[1],
                        lightness: restoreHue[2],
                      });

                      // console.log("HUE_Restore:: ", restoreHue);
                      triggerRender((prev) => !prev);
                    }}
                  >
                    restore
                  </button>
                )}
                <span style={{ fontWeight: 600 }}>&nbsp;{hueResult}</span>
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
                {Math.round(colorHSL.current?.color[1] * 10) / 10 !==
                  Math.round(color.hsl()?.color[1] * 10) / 10 && (
                  <button
                    className="btn restore-btn"
                    style={{ fontSize: "10px" }}
                    onClick={(e) => {
                      // colorHSL.current?.color[0] = color.hsl()?.color[0];
                      // const saturation =
                      //   Math.round(color.hsl()?.color[1] * 10) / 10;
                      const saturation = color.hsl()?.color[1];
                      const restoreSaturation = [
                        colorHSL.current?.color[0],
                        saturation,
                        colorHSL.current?.color[2],
                      ];

                      colorHSL.current = {
                        ...color.hsl(),
                        color: [...restoreSaturation],
                      };
                      colorTransform.current = Color({
                        h: restoreSaturation[0],
                        s: restoreSaturation[1],
                        l: restoreSaturation[2],
                      });

                      colorUpdater({
                        hue: restoreSaturation[0],
                        saturation: restoreSaturation[1],
                        lightness: restoreSaturation[2],
                      });

                      // console.log("SATURATION_Restore:: ", restoreSaturation);
                      triggerRender((prev) => !prev);
                    }}
                  >
                    restore
                  </button>
                )}
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
              <td style={{ position: "relative" }}>
                {Math.round(colorHSL.current?.color[2] * 10) / 10 !==
                  Math.round(color.hsl()?.color[2] * 10) / 10 && (
                  <button
                    className="btn restore-btn"
                    style={{ fontSize: "10px" }}
                    onClick={(e) => {
                      // colorHSL.current?.color[0] = color.hsl()?.color[0];
                      // const lightness =
                      //   Math.round(color.hsl()?.color[2] * 10) / 10;
                      const lightness = color.hsl()?.color[2];
                      const restoreLightness = [
                        colorHSL.current?.color[0],
                        colorHSL.current?.color[1],
                        lightness,
                      ];

                      colorHSL.current = {
                        ...color.hsl(),
                        color: [...restoreLightness],
                      };
                      colorTransform.current = Color({
                        h: restoreLightness[0],
                        s: restoreLightness[1],
                        l: restoreLightness[2],
                      });

                      colorUpdater({
                        hue: restoreLightness[0],
                        saturation: restoreLightness[1],
                        lightness: restoreLightness[2],
                      });

                      // console.log("LIGHTNESS_Restore:: ", restoreLightness);
                      triggerRender((prev) => !prev);
                    }}
                  >
                    restore
                  </button>
                )}
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
                  {`color.rotate(${codeHue})`}
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
      </div>
    </>
  );
}

export default React.memo(Mixers);

import React, { useState, useRef, useCallback } from "react";
import Color from "color";

import HueRow from "./HueRow";
import SaturationRow from "./SaturationRow";
import LightnessRow from "./LightnessRow";

function Mixers({ colorValue, colorDisplay }) {
  let color;
  try {
    color = new Color(colorValue);
  } catch (error) {
    color = new Color("#DC143C");
  }

  const [, triggerRender] = useState(false); // To be used when we need to trigger rerender manually
  const colorTransform = useRef(color);
  const colorHSL = useRef(color.hsl());

  const codeHue =
    Math.round((colorHSL.current?.color[0] - color.hsl()?.color[0]) * 1000) /
    1000;

  const saturation1 = colorHSL.current?.color[1];
  const saturation2 = color.hsl()?.color[1];
  const s_calc_divisor = saturation2 || 1; // To avoid Infinity result when saturation is 0
  const s_calculation = (saturation1 - saturation2) / s_calc_divisor;
  const codeSaturation = Math.abs(Math.round(s_calculation * 1000) / 1000);

  const lightness1 = colorHSL.current?.color[2];
  const lightness2 = color.hsl()?.color[2];
  const l_calc_divisor = lightness2 || 1; // To avoid Infinity result when lightness is 0
  const l_calculation = (lightness1 - lightness2) / l_calc_divisor;
  const codeLightness = Math.abs(Math.round(l_calculation * 1000) / 1000);

  const updateColorVars = useCallback((newColorDiff) => {
    colorTransform.current = newColorDiff;
    colorHSL.current = newColorDiff.hsl();
    colorDisplay({
      hue: newColorDiff.hsl()?.color[0], // BUG on late update when we use hueResult Variable
      saturation: newColorDiff.hsl()?.color[1],
      lightness: newColorDiff.hsl()?.color[2],
    });
  }, []);

  const causeRender = useCallback(() => {
    triggerRender((prev) => !prev); // To update UI
  }, []);

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
              <HueRow
                color={color}
                updateColorVars={updateColorVars}
                colorHSL={colorHSL}
                colorTransform={colorTransform}
                causeRender={causeRender}
              />
            </tr>
            <tr>
              <SaturationRow
                color={color}
                updateColorVars={updateColorVars}
                colorHSL={colorHSL}
                colorTransform={colorTransform}
                causeRender={causeRender}
              />
            </tr>
            <tr>
              <LightnessRow
                color={color}
                updateColorVars={updateColorVars}
                colorHSL={colorHSL}
                colorTransform={colorTransform}
                causeRender={causeRender}
              />
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

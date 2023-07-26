import { useRef } from "react";
import Color from "color";

import ResultInput from "./ResultInput";

function LightnessRow({
  color,
  colorTransform,
  colorHSL,
  causeRender,
  updateColorVars,
}) {
  const lightnessRatio = useRef(0.1);
  const lightnessResult = colorHSL.current?.color[2];

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

    updateColorVars(newColorDiff);

    causeRender(); // To update UI
  }
  function lightnessResultChange(resultValue) {
    const newValue = Number(resultValue);
    if (newValue < 0 || newValue > 100) return;

    const newColorDiff = colorTransform.current.lightness(newValue);

    updateColorVars(newColorDiff);

    causeRender();
  }

  return (
    <>
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
    </>
  );
}

export default LightnessRow;

import { useRef, useCallback } from "react";
import Color from "color";

import ResultInput from "./ResultInput";

function SaturationRow({
  color,
  colorTransform,
  colorHSL,
  causeRender,
  updateColorVars,
}) {
  const saturationRatio = useRef(0.1);

  const saturationResult = colorHSL.current?.color[1];

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

    updateColorVars(newColorDiff);
    causeRender(); // To update UI
  }

  const saturationResultChange = useCallback(function (resultValue) {
    const newValue = Number(resultValue);
    if (newValue < 0 || newValue > 100) return;

    const newColorDiff = colorTransform.current.saturationl(newValue);

    updateColorVars(newColorDiff);

    causeRender(); // To update UI
  }, []);

  return (
    <>
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
    </>
  );
}

export default SaturationRow;

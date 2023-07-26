import { useState, useCallback, memo } from "react";
import ResultInput from "./ResultInput";

function HueRow({
  color,
  colorHSL,
  colorTransform,
  updateColorVars,
  causeRender,
}) {
  const [hueSliderVal, setHueSliderVal] = useState(
    Math.round(color.hsl()?.color[0])
  );

  const hueResult = colorHSL.current?.color[0];

  function handleHueChange(inpValue) {
    const newValue = Number(inpValue);

    const newColorDiff = colorTransform.current.hue(newValue);
    updateColorVars(newColorDiff);

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

    updateColorVars(newColorDiff);

    setHueSliderVal(sliderValue);
    // Above Hue setState won't rerender UI if clicked button rounds off and arrives at initial color hue
    // So we ensure rerender is triggered to update the useRefs in the UI
    causeRender();
  }, []);

  return (
    <>
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
                  Number(hueSliderVal) - 1 > 0 ? Number(hueSliderVal) - 1 : 0,
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
    </>
  );
}

export default memo(HueRow);

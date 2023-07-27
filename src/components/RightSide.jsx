import { useState, useRef, useCallback, memo, useEffect } from "react";
import Color from "color";

import Mixers from "./mixers/Mixers";

const RightSide = ({ colorValue, setColorValue }) => {
  let color;
  try {
    color = new Color(colorValue);
  } catch (error) {
    color = new Color("#DC143C");
  }

  const [, triggerRender] = useState(false);
  const [colorDisplayFormat, setColorDisplayFormat] = useState("hsl");
  const manipulatedColor = useRef(color);
  const colorResultTextBg = useRef(null);

  let colorInView;
  switch (colorDisplayFormat) {
    case "hex":
      colorInView = manipulatedColor.current.hex();
      break;
    case "rgb":
      colorInView = manipulatedColor.current.rgb().string(2);
      break;
    case "hsl":
      // colorInView = manipulatedColor.current.hsl().string(2); // has ambigous rounding off
      const hsl = {
        h: Math.round(manipulatedColor.current.hsl()?.color[0] * 100) / 100,
        s: Math.round(manipulatedColor.current.hsl()?.color[1] * 100) / 100,
        l: Math.round(manipulatedColor.current.hsl()?.color[2] * 100) / 100,
      };
      colorInView = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
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

  useEffect(() => {
    if (!manipulatedColor.current) return;

    if (colorResultTextBg.current) {
      const contrastResult = bgContrast(
        manipulatedColor.current.hex(),
        "#5b6467" // Same color as set in css bg-image
      );

      colorResultTextBg.current.style.backgroundImage = `linear-gradient(90deg, ${contrastResult.bgColor
        .alpha(0.102)
        .hexa()} 2%, ${contrastResult.bgColor
        .alpha(0.357)
        .hexa()} 40%, ${contrastResult.bgColor.alpha(0.212).hexa()} 90%)`;

      const negatedColor = contrastResult.bgColor.negate().rgb().string();
      colorResultTextBg.current.style.color = negatedColor;
      colorResultTextBg.current.style.setProperty(
        "--text-shadow",
        contrastResult.bgColor.hex()
      );
    }
  }, [manipulatedColor.current]);

  function bgContrast(bg1Color, bg2Color = "#5b6467") {
    const processedCssColor = bg1Color;
    const processedColor = Color(processedCssColor);
    const resultTxtCssBgColor = bg2Color;
    let resultTxtBgColor = Color(resultTxtCssBgColor);

    let contrastRatio = resultTxtBgColor.contrast(processedColor);
    let maxTryRate = 5;

    while (contrastRatio < 6 && maxTryRate > 0) {
      maxTryRate--;

      if (processedColor.isDark()) {
        resultTxtBgColor = resultTxtBgColor.lighten(0.5);
      } else {
        resultTxtBgColor = resultTxtBgColor.darken(0.5);
      }
      contrastRatio = resultTxtBgColor.contrast(processedColor);
    }

    return {
      bgColor: resultTxtBgColor,
      contrastRatio,
    };
  }

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
          <div className="color-result-text-bg" ref={colorResultTextBg}>
            <p
              className="color-result-text"
              // style={{
              //   color: manipulatedColor.current.negate().rgb().string(),
              // }}
            >
              {colorInView}
            </p>
          </div>
        </div>
        <p
          style={{
            color: `${colorInView}`,
            width: "100%",
            fontWeight: "700",
            fontSize: "1.085rem",
          }}
        >
          This is a sample text with chosen color. This is a sample text with
          chosen color. This is a sample text with chosen color.
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
        style={{ fontSize: "1.1rem" }}
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

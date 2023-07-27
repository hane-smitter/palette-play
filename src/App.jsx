import { useState, useCallback, useLayoutEffect } from "react";
import Typography from "@mui/material/Typography";

import "./App.css";
import LeftSide from "./components/LeftSide";
import RightSide from "./components/RightSide";
import BgColorPicker from "./components/BgColorChanger";
import Color from "color";

let rightSideKey = 1;

let defaultBgColor = "#ffffff";
const bgCSSPropName = "--bg-color";
let defaultTxtColor = "#000000";
const txtCSSPropName = "--txt-color";
const typographyElemAccessor = document.documentElement;

const defaultThemeSupported = window.CSS.supports(
  "(background-color: Canvas) or (color: CanvasText)"
);

if (defaultThemeSupported) {
  defaultBgColor = "Canvas";
  defaultTxtColor = "CanvasText";
}

function App() {
  const [colorValue, setColorValue] = useState("#DC143C"); // #ff63b6
  const [changeBg, setChangeBg] = useState(false);

  const bgDefaultValue =
    JSON.parse(localStorage.getItem("bgDefault")) || defaultBgColor;

  const colorChanger = useCallback(
    (value) => {
      value = String(value).toLowerCase();
      setColorValue();
    },
    [colorValue]
  );
  const newColorPalette = useCallback(
    (value) => {
      value = String(value).toLowerCase();
      setColorValue(value);
      rightSideKey++;
    },
    [colorValue]
  );

  useLayoutEffect(() => {
    const storedBgColor = JSON.parse(localStorage.getItem("bgDefault"));
    let backgroundColor = defaultBgColor;
    let textColor = defaultTxtColor;

    if (storedBgColor) {
      const results = contrastTxtToBgColor(defaultTxtColor, storedBgColor);
      backgroundColor = results.pageBgColor;
      textColor = results.pageTxtColor;
    }

    typographyElemAccessor.style.setProperty(bgCSSPropName, backgroundColor);
    typographyElemAccessor.style.setProperty(txtCSSPropName, textColor);
  }, []);

  /**
   * Factory to generate contrasting text color, of at least 4.5, from background color.
   * @typedef {Object} Contrasted
   * @property {string} pageBgColor - The background color.
   * @property {string} pageTxtColor - The text color.
   * @property {number} contrastRatio - Contrast ratio between text color and background color.
   */

  /**
   * Adjusts text color for correct visibility on background.
   *
   * `NOTE`: A value with Canvas on `bgColor` will lead to no contrast calculation
   * @param {string} txtColor
   * @param {string} bgColor
   * @returns {Contrasted}
   */
  function contrastTxtToBgColor(txtColor, bgColor) {
    const regex = /canvas(text)?/i;

    if (regex.test(bgColor)) {
      return {
        pageBgColor: bgColor,
        pageTxtColor: txtColor,
        contrastRatio: 0,
      };
    } else if (regex.test(txtColor) && !regex.test(bgColor)) {
      txtColor = new Color(bgColor).negate().rgb().string();
    }

    let pageBgColor = new Color(bgColor);
    let pageTxtColor = new Color(txtColor);
    let contrastRatio = pageTxtColor.contrast(pageBgColor);
    let maxTryRate = 8;

    while (contrastRatio < 4.5 && maxTryRate > 0) {
      maxTryRate--;

      if (pageBgColor.isDark()) {
        pageTxtColor = pageTxtColor.lighten(0.4);
      } else {
        pageTxtColor = pageTxtColor.darken(0.4);
      }
      contrastRatio = pageTxtColor.contrast(pageBgColor);
    }
    return {
      pageBgColor: pageBgColor.rgb().string(),
      pageTxtColor: pageTxtColor.rgb().string(),
      contrastRatio,
    };
  }

  function handleChangeBg(event) {
    const newBgColor = event?.target?.value;

    const computedStyle = window.getComputedStyle(typographyElemAccessor);

    const currentCssTxtProp = computedStyle.getPropertyValue(txtCSSPropName);

    const contrastedResults = contrastTxtToBgColor(
      currentCssTxtProp,
      newBgColor
    );

    localStorage.setItem("bgDefault", JSON.stringify(newBgColor));

    typographyElemAccessor.style.setProperty(
      bgCSSPropName,
      contrastedResults.pageBgColor
    );
    typographyElemAccessor.style.setProperty(
      txtCSSPropName,
      contrastedResults.pageTxtColor
    );
  }

  return (
    <>
      {!changeBg ? (
        <Typography
          variant="h4"
          component="h1"
          style={{
            // mixBlendMode: "difference",
            textDecoration: "underline",
            cursor: "pointer",
            marginBottom: "20px",
          }}
          // className="contrast"
          onClick={() => setChangeBg(true)}
        >
          Change background color?
        </Typography>
      ) : (
        <BgColorPicker
          setChangeBg={setChangeBg}
          handleChangeBg={handleChangeBg}
          bgDefaultValue={bgDefaultValue}
        />
      )}

      <div className="buckle color-container">
        <LeftSide colorValue={colorValue} setColorValue={newColorPalette} />
        <RightSide
          colorValue={colorValue}
          setColorValue={colorChanger}
          key={rightSideKey}
        />
      </div>

      <footer
        style={{
          marginTop: "20px",
          backgroundColor: "#8b939a",
          padding: "2rem 0",
        }}
      >
        Made by <a href="https://twitter.com/smitterhane">@smittehane</a>
      </footer>
    </>
  );
}

export default App;

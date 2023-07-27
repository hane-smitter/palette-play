import { useRef } from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

function BgColorPicker({ setChangeBg, handleChangeBg, bgDefaultValue }) {
  const colorInp = useRef(null);
  //   useEffect(() => {
  //     colorInp && colorInp.current.click();
  //   }, []);
  return (
    <div
      style={{
        marginBottom: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div style={{ width: "100%" }}>
        <Tooltip title="close" arrow>
          <IconButton
            onClick={() => setChangeBg(false)}
            className="contrast"
            style={{ color: "unset", margin: "auto" }}
          >
            X
          </IconButton>
        </Tooltip>
      </div>
      <div>
        <label htmlFor="choose-color">Tap to pick background</label>
        <span>&nbsp;👉️</span>&nbsp;&nbsp;&nbsp;
        <input
          type="color"
          onChange={handleChangeBg}
          id="choose-color"
          defaultValue={bgDefaultValue}
          ref={colorInp}
          style={{
            border: "2.2px solid var(--txt-color)",
            borderRadius: "5px",
          }}
        />
      </div>
    </div>
  );
}

export default BgColorPicker;

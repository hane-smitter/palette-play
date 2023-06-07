const LeftSide = ({ colorValue, setColorValue }) => {
  function handleColorChange(event) {
    setColorValue(event.target.value);
  }

  return (
    <div>
      <div className="color-input-box">
        <label for="color-val">Enter a color:&nbsp;&nbsp;&nbsp;</label>
        <br />
        <input
          type="text"
          name="color-value"
          id="color-val"
          value={colorValue}
          onChange={handleColorChange}
        />
      </div>
      <div className="color-result-box">
        <div
          className="color-result"
          style={{ backgroundColor: `${colorValue}` }}
        ></div>
      </div>
    </div>
  );
};

export default LeftSide;

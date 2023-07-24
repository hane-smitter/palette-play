import { useRef, useState, useEffect } from "react";

function ResultInput({ resultChange, resultValue, max = 100, min = 0 }) {
  const [inpDisabled, setInpDisabled] = useState(true);
  const [inputValue, setInputValue] = useState(Number(resultValue));
  const [triggerSubmission, setTriggerSubmission] = useState(false);
  const inputElem = useRef(null);

  function handleInpChange(event) {
    event.preventDefault();
    setInputValue(Number(event.target.value));
  }
  function inpSubmit(event) {
    event?.preventDefault();

    if (inputElem.current) {
      const isValid = checkValid(inputElem.current);
      isValid && resultChange(inputValue);
      inputElem.current.blur();
    }
    setInpDisabled(true);
  }

  /**
   * Checks Validity of an Input element and modifies classname
   * @param {HTMLInputElement} element Input element to check validity
   * @returns {Boolean} - Whether input has error
   */
  function checkValid(element) {
    let valid = true;
    if (element) {
      const noError = element.checkValidity();
      valid = noError;
      // console.log({ noError });

      if (noError) {
        element.classList.remove("has-error");
      } else {
        element.classList.add("has-error");
      }
    }

    return valid;
  }

  useEffect(() => {
    const Controller = new AbortController();

    const elem = inputElem.current;
    if (elem) {
      elem.addEventListener(
        "dblclick",
        () => {
          setInpDisabled(false);
        },
        {
          signal: Controller.signal,
        }
      );
      elem.addEventListener(
        "blur",
        () => {
          if (elem.readOnly === true) return;
          setTriggerSubmission((prev) => !prev);
        },
        {
          signal: Controller.signal,
        }
      );
    }

    return () => {
      Controller.abort("Color result listener(s) aborted");
    };
  }, []);

  useEffect(() => {
    setInputValue(resultValue);
    checkValid(inputElem.current);
  }, [resultValue]);

  useEffect(() => {
    inpSubmit();
  }, [triggerSubmission]);

  return (
    <form onSubmit={inpSubmit} style={{ margin: 0 }}>
      <input
        ref={inputElem}
        type="number"
        readOnly={inpDisabled}
        value={inputValue}
        max={max}
        min={min}
        step={0.01}
        onChange={handleInpChange}
        className="color-result-input"
      />
    </form>
  );
}

export default ResultInput;

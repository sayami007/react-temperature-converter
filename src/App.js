import { useState, useRef, useMemo } from "react";

function App() {
  const units = useMemo(() => [
    { text: "Fahrenheit", suffix: 'F', value: 1 },
    { text: "Celsius", suffix: 'C', value: 2 },
    { text: "Kelvin", suffix: 'K', value: 3 },
  ], []);
  const [resultText, setResultText] = useState("");
  const [fromUnitDD, setFromUnitDD] = useState(units);
  const [toUnitDD, setToUnitDD] = useState(units);
  const inputField = useRef(null);
  const fromUnitField = useRef(null);
  const toUnitField = useRef(null);

  const getUnitDetails = (unitValue) => units.find(unit => unit.value === unitValue) || { text: '', suffix: '' };


  const handleClick = () => {
    const [inputValue, fromUnit, toUnit] = [
      Number(inputField.current.value),
      Number(fromUnitField.current.value),
      Number(toUnitField.current.value),
    ];
    const { text: fromUnitText, suffix: fromUnitSuffix } = getUnitDetails(fromUnit);
    const { text: toUnitText, suffix: toUnitSuffix } = getUnitDetails(toUnit);
    if (fromUnitText && toUnitText) {
      const result = onCalculateTemp(inputValue, fromUnit, toUnit);
      setResultText(`Your result from ${inputValue}${fromUnitSuffix} ${fromUnitText} to ${toUnitText} is ${result.toFixed(3)}${toUnitSuffix}`);
    } else {
      setResultText('Invalid unit selection.');
    }
  };

  const handleDDChange = (ddType, ddValue) => {
    const finalUnits = units.filter(({ value }) => value !== Number(ddValue));
    ddType === 1 ? setToUnitDD(finalUnits) : setFromUnitDD(finalUnits);
  };

  const onCalculateTemp = (inputValue, fromUnit, toUnit) => {
    if (fromUnit === toUnit) return inputValue;
    const conversionMap = {
      1: {
        // Fahrenheit
        2: (val) => (val - 32) / 1.8, // Fahrenheit to Celsius
        3: (val) => (val - 32) / 1.8 + 273.15, // Fahrenheit to Kelvin
      },
      2: {
        // Celsius
        1: (val) => val * 1.8 + 32, // Celsius to Fahrenheit
        3: (val) => val + 273.15, // Celsius to Kelvin
      },
      3: {
        // Kelvin
        1: (val) => (val - 273.15) * 1.8 + 32, // Kelvin to Fahrenheit
        2: (val) => val - 273.15, // Kelvin to Celsius
      },
    };
    return conversionMap[fromUnit][toUnit](inputValue);
  };

  return (
    <div className="container d-flex justify-content-center flex-column h-full height-100">
      <h1 className="h1">Temperature Converter</h1>
      <div className="d-flex gap-2">
        <input
          type="number"
          name="Unit"
          id="Unit"
          ref={inputField}
          placeholder="0.00"
        ></input>
        <select
          name="FromUnit"
          id="FromUnit"
          ref={fromUnitField}
          onChange={(e) => handleDDChange(1, e.target.value)}
        >
          <option value="">Select</option>
          {fromUnitDD.map((unit) => {
            return (
              <option value={unit.value} key={unit.value}>
                {unit.text}
              </option>
            );
          })}
        </select>
        <select
          name="ToUnit"
          id="ToUnit"
          ref={toUnitField}
          onChange={(e) => handleDDChange(2, e.target.value)}
        >
          <option value="">Select</option>
          {toUnitDD.map((unit) => {
            return (
              <option value={unit.value} key={unit.value}>
                {unit.text}
              </option>
            );
          })}
        </select>
        <button className="btn btn-primary" onClick={handleClick}>Convert</button>
      </div>
      <div>{resultText}</div>
    </div>
  );
}

export default App;

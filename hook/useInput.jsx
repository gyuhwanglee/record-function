import { useState } from 'react';

const useInput = (initialData, limitLength) => {
  const [value, setValue] = useState(initialData);
  const handler = e => {
    const inputValue = e.target.value;
    if (inputValue.length <= limitLength) {
      setValue(inputValue);
    } else if (limitLength === undefined) {
      setValue(inputValue);
    }
  };
  return [value, handler, setValue];
};

export default useInput;
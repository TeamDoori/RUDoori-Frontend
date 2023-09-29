import { createContext, useEffect, useState } from "react";

const SelectContext = createContext({
  selectKeyword: [],
  handleSetSelectKeyword: () => {},
  handleSetRemoveKeyword: () => {},
});

const SelectProvider = ({ children }) => {
  useEffect(() => {
    console.log("키워드: " + selectKeyword);
  }, selectKeyword);
  const [selectKeyword, setSelectKeyword] = useState([]);

  const handleSetSelectKeyword = (values) => {
    setSelectKeyword((selectKeyword) => [...selectKeyword, values]);
  };

  const handleSetRemoveKeyword = (text) => {
    //console.log("values: " + values);
    setSelectKeyword((selectKeyword) =>
      selectKeyword.filter((keyword) => keyword !== text),
    );
  };

  const value = {
    selectKeyword,
    handleSetSelectKeyword,
    handleSetRemoveKeyword,
  };

  return (
    <SelectContext.Provider value={value}>{children}</SelectContext.Provider>
  );
};

export { SelectContext, SelectProvider };

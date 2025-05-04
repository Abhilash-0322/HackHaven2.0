import React, { createContext, useState, useContext } from 'react';

// Create context to share the active tab value
const TabsContext = createContext(null);

export const Tabs = ({ defaultValue, onValueChange, children, className }) => {
  const [value, setValue] = useState(defaultValue || '');

  const handleValueChange = (newValue) => {
    setValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ value, onChange: handleValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className }) => {
  return (
    <div className={className} role="tablist">
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, children, className }) => {
  const { value: selectedValue, onChange } = useContext(TabsContext);
  const isActive = selectedValue === value;
  
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onChange(value)}
      className={`${className} ${
        isActive 
          ? 'bg-purple-100 text-purple-800 font-medium' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } rounded-lg transition-colors`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className }) => {
  const { value: selectedValue } = useContext(TabsContext);
  
  if (value !== selectedValue) return null;
  
  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
};
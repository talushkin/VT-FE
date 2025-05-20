import * as React from "react";
import Select from "react-select/creatable";

export default function NameSelect({
  clients,
  setClient,
  client,
  onClientChange,
  setClients,
  padding
}) {
  const handleCreateOption = (inputValue) => {
    const newOption = {
      value: inputValue,
      label: inputValue,
    };

    setClients((clients) => [...clients, newOption]);
    setClient({ firstName: newOption.value });
  };

  return (
    <Select
      value={client}
      onChange={(e) => onClientChange(e, "firstName", true)}
      getOptionLabel={(option) => option.value || option?.firstName}
      getOptionValue={(option) => {
        return option;
      }}
      options={clients}
      onCreateOption={handleCreateOption}
      className="form-control border"
      
      styles={{
        container: (baseStyles, state)=>({
          ...baseStyles,
          padding: padding,
          
        }),
        control: (baseStyles, state) => ({
          ...baseStyles,
          borderColor: state.isFocused ? 'white !important' : 'white !important',
          borderColor: state.isHover ? 'white !important' : 'white !important',
          borderColor: state.isActive ? 'white !important' : 'white !important',
          borderColor: state.isTarget ? 'white !important' : 'white !important',
          boxShadow: "white !important"
        }),
      }}
    />
  );
}

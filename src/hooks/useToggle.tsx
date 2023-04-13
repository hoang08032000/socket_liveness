import React from "react";

export default function useToggle(defaultValue: boolean): [boolean, (value: boolean) => void] {
  const [value, setValue] = React.useState<boolean>(defaultValue);

  function toggleValue(value: boolean) {
    setValue((currentValue) =>
      typeof value === "boolean" ? value : !currentValue
    );
  }

  return [value, toggleValue];
}

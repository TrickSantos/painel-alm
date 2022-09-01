import React, { ReactElement } from "react";
import { Select as SelectCombo, Typography } from "antd";
import { useController, UseControllerProps } from "react-hook-form";
import { SelectProps, SelectValue } from "antd/lib/select";

const { Text } = Typography;

export function Select(
  props: UseControllerProps &
    Omit<SelectProps<SelectValue>, keyof UseControllerProps>
): ReactElement {
  const {
    field,
    fieldState: { error },
  } = useController(props);
  return (
    <>
      <SelectCombo {...props} style={{ width: "100%" }} {...field} size="large">
        {props.children}
      </SelectCombo>
      {error && <Text type="danger">{error.message}</Text>}
    </>
  );
}

Select.Option = SelectCombo.Option;
Select.OptGroup = SelectCombo.OptGroup;
export default Select;

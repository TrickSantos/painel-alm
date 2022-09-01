import { Dayjs } from "dayjs";
import * as React from "react";
import locale from "antd/lib/date-picker/locale/pt_BR";
import { PickerTimeProps } from "antd/es/date-picker/generatePicker";
import { Picker } from "./DatePicker";
import { useController, UseControllerProps } from "react-hook-form";
import { Typography } from "antd";

export interface TimePickerProps
  extends Omit<PickerTimeProps<Dayjs>, "picker"> {}

const { Text } = Typography;
const Time = React.forwardRef<any, TimePickerProps>((props, ref) => {
  return (
    <Picker
      {...props}
      size="large"
      locale={locale}
      picker="time"
      mode={undefined}
      ref={ref}
    />
  );
});

Time.displayName = "TimePicker";

function TimePicker(
  props: UseControllerProps & Omit<TimePickerProps, keyof UseControllerProps>
) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  return (
    <>
      <Time
        {...props}
        {...field}
        locale={locale}
        style={{ width: "100%" }}
        format="HH:mm"
        size="large"
        minuteStep={10}
      />
      {error && <Text type="danger">{error.message}</Text>}
    </>
  );
}

export default TimePicker;

import { Dayjs } from "dayjs";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import generatePicker, {
  PickerProps,
} from "antd/es/date-picker/generatePicker";
import { Typography } from "antd";
import { useController, UseControllerProps } from "react-hook-form";
import { PickerComponentClass } from "antd/es/date-picker/generatePicker/interface";
import locale from "antd/lib/date-picker/locale/pt_BR";
import "antd/es/date-picker/style/index";

export const Picker = generatePicker<Dayjs>(dayjsGenerateConfig);
const { Text } = Typography;

function DatePicker(
  props: UseControllerProps &
    Omit<PickerComponentClass<PickerProps<Date>>, keyof UseControllerProps>
) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  return (
    <>
      <Picker
        {...props}
        {...field}
        locale={locale}
        style={{ width: "100%" }}
        format="DD/MM/YYYY"
        size="large"
      />
      {error && <Text type="danger">{error.message}</Text>}
    </>
  );
}
export default DatePicker;

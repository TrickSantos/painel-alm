import {
  InputProps,
  Input as InputAntd,
  Typography,
  InputNumber,
  InputNumberProps,
} from "antd";
import { PasswordProps, TextAreaProps } from "antd/lib/input";
import { useController, UseControllerProps } from "react-hook-form";

const { Text } = Typography;

function Input(
  props: UseControllerProps & Omit<InputProps, keyof UseControllerProps>
) {
  const {
    field,
    fieldState: { error },
  } = useController(props);
  return (
    <>
      <InputAntd style={{ width: "100%" }} {...props} {...field} size="large" />
      {error && <Text type="danger">{error.message}</Text>}
    </>
  );
}

Input.Number = function Number(
  props: UseControllerProps & Omit<InputNumberProps, keyof UseControllerProps>
) {
  const {
    field,
    fieldState: { error },
  } = useController({
    ...props,
  });
  return (
    <>
      <InputNumber {...props} {...field} size="large" />
      {error && <Text type="danger">{error.message}</Text>}
    </>
  );
};

Input.Email = function Email(
  props: UseControllerProps & Omit<InputProps, keyof UseControllerProps>
) {
  const {
    field,
    fieldState: { error },
  } = useController({
    ...props,
    rules: {
      required: "E-mail é obrigatório",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        message: "Entre com um email válido",
      },
    },
  });
  return (
    <>
      <InputAntd {...props} {...field} size="large" placeholder="Email" />
      {error && <Text type="danger">{error.message}</Text>}
    </>
  );
};

Input.TextArea = function Area(
  props: UseControllerProps & Omit<TextAreaProps, keyof UseControllerProps>
) {
  const {
    field,
    fieldState: { error },
  } = useController(props);
  return (
    <>
      <InputAntd.TextArea {...props} {...field} size="large" autoSize />
      {error && <Text>{error.message}</Text>}
    </>
  );
};

Input.Password = function Password(
  props: UseControllerProps & Omit<PasswordProps, keyof UseControllerProps>
) {
  const {
    field,
    fieldState: { error },
  } = useController(props);
  return (
    <>
      <InputAntd.Password {...props} {...field} size="large" />
      {error && <Text>{error.message}</Text>}
    </>
  );
};

export default Input;

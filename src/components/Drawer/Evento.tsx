import {
  Button,
  Col,
  Drawer,
  DrawerProps,
  message,
  Row,
  Spin,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import DatePicker from "../Controlled/DatePicker";
import Input from "../Controlled/Input";
import TimePicker from "../Controlled/TimePicker";

const { Title } = Typography;

function Evento(props: DrawerProps) {
  const { socket } = useAuth();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset, watch } = useFormContext();
  const eventoId = watch("id");

  const onUpdate = (data: any) => {
    setLoading(true);
    socket.emit("evento:update", data, (res: any) => {
      if (res.status === "error") {
        res.message.forEach((msg: string) => message.error(msg));
      } else {
        res.message.forEach((msg: string) => message.success(msg));
        reset({});
      }
    });
  };

  const onSave = (data: any) => {
    setLoading(true);
    console.log(data);
    socket.emit("evento:create", data, (res: any) => {
      if (res.status === "error") {
        res.message.forEach((msg: string) => message.error(msg));
      } else {
        res.message.forEach((msg: string) => message.success(msg));
        reset({});
      }
    });
    setLoading(false);
  };

  const onSubmit = async () => {
    eventoId ? handleSubmit(onUpdate)() : handleSubmit(onSave)();
  };

  return (
    <Drawer {...props} title="Novo Evento">
      <Spin spinning={loading}>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Title level={5}>Nome:</Title>
            <Input
              control={control}
              name="nome"
              rules={{ required: "O nome do evento precisa ser informado" }}
            />
          </Col>
          <Col span={24}>
            <Title level={5}>Descrição:</Title>
            <Input
              control={control}
              name="descricao"
              rules={{
                required: "A descrição do evento precisa ser informada",
              }}
            />
          </Col>
          <Col span={24}>
            <Title level={5}>Pontuação:</Title>
            <Input.Number
              style={{ width: "100%" }}
              control={control}
              name="pontos"
              rules={{
                required: "A pontuação do evento precisa ser informada",
              }}
            />
          </Col>

          <Col span={12}>
            <Title level={5}>Ínicio</Title>
            <DatePicker
              control={control}
              name="inicio"
              rules={{
                required: "O inicio do evento precisa ser informado",
              }}
            />
          </Col>
          <Col span={12}>
            <Title level={5}>Hora</Title>
            <TimePicker control={control} name="inicio" />
          </Col>
          <Col span={12}>
            <Title level={5}>Fim</Title>
            <DatePicker
              control={control}
              name="fim"
              rules={{
                required: "O fim do evento precisa ser informado",
              }}
            />
          </Col>
          <Col span={12}>
            <Title level={5}>Hora</Title>
            <TimePicker control={control} name="fim" />
          </Col>
          <Col span={12}>
            <Button block type="primary" onClick={onSubmit}>
              Salvar
            </Button>
          </Col>
          <Col span={12}>
            <Button block type="primary" danger onClick={props.onClose}>
              Cancelar
            </Button>
          </Col>
        </Row>
      </Spin>
    </Drawer>
  );
}

export default Evento;

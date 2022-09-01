import { Button, Col, Drawer, DrawerProps, Row, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import Input from "../Controlled/Input";

const { Title } = Typography;

function Clube(props: DrawerProps) {
  const { socket } = useAuth();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset, watch } = useFormContext();
  const clubeId = watch("id");

  const onUpdate = (data: any) => {
    setLoading(true);
    try {
      socket.emit("clube:update", data);
      reset({});
      props.onClose;
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const onSave = (data: any) => {
    setLoading(true);
    try {
      socket.emit("clube:create", data);
      reset({});
      props.onClose;
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const onSubmit = async () => {
    clubeId ? handleSubmit(onUpdate)() : handleSubmit(onSave)();
  };

  return (
    <Drawer {...props} title="Novo Clube">
      <Spin spinning={loading}>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Title level={5}>Nome:</Title>
            <Input
              control={control}
              name="nome"
              rules={{ required: "O nome precisa ser informado" }}
            />
          </Col>
          <Col span={24}>
            <Title level={5}>Cidade:</Title>
            <Input
              control={control}
              name="cidade"
              rules={{ required: "A cidade precisa ser informada" }}
            />
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

export default Clube;

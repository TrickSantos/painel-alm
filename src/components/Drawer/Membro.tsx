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
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import useRouter from "../../hooks/useRoute";
import Input from "../Controlled/Input";
import Select from "../Controlled/Select";

const { Title } = Typography;

function Membro(props: DrawerProps) {
  const { socket } = useAuth();
  const { params } = useRouter();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset, watch } = useFormContext();
  const membroId = watch("id");
  const role = watch("funcao");

  const onUpdate = (data: any) => {
    setLoading(true);
    try {
      socket.emit("usuario:update", data);
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
    console.log(data);
    socket.emit(
      "usuario:create",
      { ...data, clubeId: Number(params.id) },
      (res: any) => {
        if (res.status === "error") {
          res.message.forEach((msg: string) => message.error(msg));
        } else {
          res.message.forEach((msg: string) => message.success(msg));
          reset({});
        }
      }
    );
    setLoading(false);
  };

  const onSubmit = async () => {
    membroId ? handleSubmit(onUpdate)() : handleSubmit(onSave)();
  };

  return (
    <Drawer {...props} title="Novo Membro">
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
            <Title level={5}>Função:</Title>
            <Select
              name="funcao"
              control={control}
              defaultValue={"desbravador"}
            >
              <Select.Option value={"desbravador"}>Desbravador</Select.Option>
              <Select.Option value={"administrador"}>
                Administrador
              </Select.Option>
              <Select.Option value={"diretoria"}>
                Diretoria (Diretor, Conselheiro, Secretário, etc.)
              </Select.Option>
              <Select.Option value={"apoio"}>
                Apoio (Cozinha, Enfermeira, Pastor, etc.)
              </Select.Option>
              <Select.Option value={"staff"}>Staff</Select.Option>
            </Select>
          </Col>
          {(role === "staff" || role === "administrador") && (
            <>
              <Col span={24}>
                <Title level={5}>Email:</Title>
                <Input.Email control={control} name="email" />
              </Col>
              <Col span={24}>
                <Title level={5}>Senha:</Title>
                <Input.Password
                  control={control}
                  name="password"
                  rules={{ required: "A senha precisa ser informada" }}
                />
              </Col>
            </>
          )}
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

export default Membro;

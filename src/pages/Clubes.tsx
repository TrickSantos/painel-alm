import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Col, PageHeader, Space, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Clube from "../components/Drawer/Clube";
import { useAuth } from "../hooks/useAuth";
import useRouter from "../hooks/useRoute";

function Clubes() {
  const { socket } = useAuth();
  const { navigate } = useRouter();
  const methods = useForm();
  const [clubes, setClubes] = useState<Clube[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    socket.emit("clube:index", (res: Clube[]) => {
      setClubes(res);
      setLoading(false);
    });
    socket.on("clube:created", () => {
      setLoading(true);
      socket.emit(
        "clube:index",

        (res: Clube[]) => {
          setClubes(res);
          setLoading(false);
        }
      );
      setOpen(false);
    });
    socket.on("clube:destroyed", () => {
      setLoading(true);
      socket.emit(
        "clube:index",

        (res: Clube[]) => {
          setClubes(res);
          setLoading(false);
        }
      );
    });
    socket.on("clube:updated", () => {
      setLoading(true);
      socket.emit(
        "clube:index",

        (res: Clube[]) => {
          setClubes(res);
          setLoading(false);
        }
      );
      setOpen(false);
    });
  }, []);

  const handleDelete = (id: number) => {
    socket.emit("clube:destroy", id);
  };

  return (
    <Col span={24}>
      <PageHeader
        title="Clubes"
        subTitle={`${clubes.length} Clubes cadastrados`}
        extra={[
          <Button
            key="new"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              methods.reset({});
              setOpen(true);
            }}
          >
            Adicionar
          </Button>,
        ]}
      />
      <Table dataSource={clubes} rowKey={(row) => row.id} loading={loading}>
        <Table.Column<Clube> title="Nome" dataIndex="nome" key="nome" />
        <Table.Column<Clube> title="Cidade" dataIndex="cidade" key="cidade" />
        <Table.Column<Clube>
          key="actions"
          render={(_, clube) => (
            <Space>
              <Tooltip title="Membros">
                <Button
                  icon={<TeamOutlined />}
                  type="text"
                  onClick={() => navigate(`${clube.id}`, { state: clube })}
                />
              </Tooltip>
              <Tooltip title="Editar">
                <Button
                  icon={<EditOutlined />}
                  type="text"
                  onClick={() => {
                    methods.reset({ ...clube });
                    setOpen(true);
                  }}
                />
              </Tooltip>
              <Button
                icon={<DeleteOutlined />}
                type="text"
                onClick={() => handleDelete(clube.id)}
              />
            </Space>
          )}
        />
      </Table>
      <FormProvider {...methods}>
        <Clube visible={open} destroyOnClose onClose={() => setOpen(false)} />
      </FormProvider>
    </Col>
  );
}

export default Clubes;

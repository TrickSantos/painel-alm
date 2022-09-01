import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, PageHeader, Space, Table } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Membro from "../components/Drawer/Membro";
import { useAuth } from "../hooks/useAuth";
import useRouter from "../hooks/useRoute";

function Membros() {
  const { params } = useRouter();
  const { socket } = useAuth();
  const methods = useForm();
  const [loading, setLoading] = useState(false);
  const [membro, setMembros] = useState<Usuario[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    socket.emit(
      "usuario:index",
      { clubeId: Number(params.id) },
      (res: Usuario[]) => {
        setMembros(res);
        setLoading(false);
      }
    );
    socket.on("usuario:created", () => {
      setLoading(true);
      socket.emit(
        "usuario:index",
        { clubeId: Number(params.id) },
        (res: Usuario[]) => {
          setMembros(res);
          setLoading(false);
        }
      );
      setOpen(false);
    });
    socket.on("usuario:destroyed", () => {
      setLoading(true);
      socket.emit(
        "usuario:index",
        { clubeId: Number(params.id) },
        (res: Usuario[]) => {
          setMembros(res);
          setLoading(false);
        }
      );
    });
    socket.on("usuario:updated", () => {
      setLoading(true);
      socket.emit(
        "usuario:index",
        { clubeId: Number(params.id) },
        (res: Usuario[]) => {
          setMembros(res);
          setLoading(false);
        }
      );
      setOpen(false);
    });
  }, []);

  const handleDelete = (id: number) => {
    socket.emit("usuario:destroy", id);
  };

  return (
    <Col span={24}>
      <PageHeader
        title="Membros"
        subTitle={`${membro.length} Membros cadastrados`}
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
      <Table dataSource={membro} rowKey={(row) => row.id} loading={loading}>
        <Table.Column<Usuario> title="Nome" dataIndex="nome" key="nome" />
        <Table.Column<Usuario>
          title="Aniversário"
          dataIndex="aniversario"
          key="aniversario"
          render={(fim) => dayjs(fim).format("DD/MM/YYYY")}
        />
        <Table.Column<Usuario>
          title="Presenças"
          dataIndex="presecas"
          key="presecas"
          render={(_, data) => data.presencas.length}
        />
        <Table.Column<Usuario>
          key="actions"
          render={(_, clube) => (
            <Space>
              <Button
                icon={<EditOutlined />}
                type="text"
                onClick={() => {
                  methods.reset({ ...clube });
                  setOpen(true);
                }}
              />
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
        <Membro visible={open} destroyOnClose onClose={() => setOpen(false)} />
      </FormProvider>
    </Col>
  );
}

export default Membros;

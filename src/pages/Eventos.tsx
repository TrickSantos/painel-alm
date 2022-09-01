import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, PageHeader, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Evento from "../components/Drawer/Evento";
import { useAuth } from "../hooks/useAuth";
import dayjs from "../services/dayjs";

function Eventos() {
  const { socket } = useAuth();
  const methods = useForm();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    socket.emit("evento:index", (res: Evento[]) => setEventos(res));
    socket.on("evento:created", () => {
      setOpen(false);
      socket.emit("evento:index", (res: Evento[]) => setEventos(res));
    });
    socket.on("evento:destroyed", () =>
      socket.emit("evento:index", (res: Evento[]) => setEventos(res))
    );
    socket.on("evento:updated", () => {
      setOpen(false);
      socket.emit("evento:index", (res: Evento[]) => setEventos(res));
    });
  }, []);

  const handleDelete = (id: number) => {
    socket.emit("evento:destroy", id);
  };

  return (
    <Col span={24}>
      <PageHeader
        title="Eventos"
        subTitle={`${eventos.length} Eventos cadastrados`}
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
      <Table dataSource={eventos} rowKey={(row) => row.id}>
        <Table.Column<Evento> title="Nome" dataIndex="nome" key="nome" />
        <Table.Column<Evento>
          title="Descrição"
          dataIndex="descricao"
          key="descricao"
        />
        <Table.Column<Evento> title="Pontos" dataIndex="pontos" key="pontos" />
        <Table.Column<Evento>
          title="Inicio"
          dataIndex="inicio"
          key="inicio"
          render={(inicio) => dayjs(inicio).format("DD/MM/YYYY HH:mm")}
        />
        <Table.Column<Evento>
          title="Fim"
          dataIndex="fim"
          key="fim"
          render={(fim) => dayjs(fim).format("DD/MM/YYYY HH:mm")}
        />
        <Table.Column<Evento>
          key="actions"
          render={(_, evento) => (
            <Space>
              <Button
                icon={<EditOutlined />}
                type="text"
                onClick={() => {
                  methods.reset({
                    ...evento,
                    fim: dayjs(evento.fim),
                    inicio: dayjs(evento.inicio),
                  });
                  setOpen(true);
                }}
              />
              <Button
                icon={<DeleteOutlined />}
                type="text"
                onClick={() => handleDelete(evento.id)}
              />
            </Space>
          )}
        />
      </Table>
      <FormProvider {...methods}>
        <Evento visible={open} destroyOnClose onClose={() => setOpen(false)} />
      </FormProvider>
    </Col>
  );
}

export default Eventos;

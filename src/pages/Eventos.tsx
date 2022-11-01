import {
  DeleteOutlined,
  EditOutlined,
  FundTwoTone,
  GlobalOutlined,
  LoadingOutlined,
  PlusOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Button, Col, PageHeader, Space, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Evento from "../components/Drawer/Evento";
import { useAuth } from "../hooks/useAuth";
import dayjs from "../services/dayjs";
import { pdf, PDFDownloadLink } from "@react-pdf/renderer";
import Relatorio from "../components/Relatorio";
import { saveAs } from "file-saver";
import { IPresencas } from "./Presencas";

function Eventos() {
  const { socket, usuario } = useAuth();
  const methods = useForm();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const generatePdfDocument = async (
    Component: any,
    filename: string,
    evento: Evento
  ) => {
    setLoading(true);
    socket.emit(
      "presenca:getPresences",
      evento.id,
      async (res: IPresencas[]) => {
        const blob = await pdf(
          <Component dados={res} evento={evento} />
        ).toBlob();

        setLoading(false);
        saveAs(blob, filename);
      }
    );
  };

  useEffect(() => {
    setLoading(true);
    socket.emit("evento:index", (res: Evento[]) => {
      setEventos(res);
      setLoading(false);
    });
    socket.on("evento:created", () => {
      setOpen(false);
      socket.emit("evento:index", (res: Evento[]) => {
        setEventos(res);
        setLoading(false);
      });
    });
    socket.on("evento:destroyed", () =>
      socket.emit("evento:index", (res: Evento[]) => {
        setEventos(res);
        setLoading(false);
      })
    );
    socket.on("evento:updated", () => {
      setOpen(false);
      socket.emit("evento:index", (res: Evento[]) => {
        setEventos(res);
        setLoading(false);
      });
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
      <Table dataSource={eventos} loading={loading} rowKey={(row) => row.id}>
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
              <Tooltip title="Presenças">
                <Link
                  to={`/telao/${evento.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button icon={<FundTwoTone />} type="text" />
                </Link>
              </Tooltip>
              <Tooltip title="Ganhador">
                <Link to="/pop" target="_blank" rel="noreferrer">
                  <Button icon={<GlobalOutlined />} type="text" />
                </Link>
              </Tooltip>
              <Tooltip title="Relatorio">
                <Button
                  icon={<PrinterOutlined />}
                  type="text"
                  onClick={() =>
                    generatePdfDocument(Relatorio, "relatorio.pdf", evento)
                  }
                />
              </Tooltip>
              {usuario?.funcao === "administrador" && (
                <Button
                  icon={<DeleteOutlined />}
                  type="text"
                  onClick={() => handleDelete(evento.id)}
                />
              )}
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

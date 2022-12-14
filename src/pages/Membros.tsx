import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  PageHeader,
  Popconfirm,
  Space,
  Table,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Membro from "../components/Drawer/Membro";
import { useAuth } from "../hooks/useAuth";
import useRouter from "../hooks/useRoute";

function Membros() {
  const { params } = useRouter();
  const { socket, usuario } = useAuth();
  const methods = useForm();
  const [loading, setLoading] = useState(false);
  const [membros, setMembros] = useState<Usuario[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const filteredList =
    search.length > 0
      ? membros.filter((membro) => membro.nome.includes(search.toUpperCase()))
      : membros;

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
        subTitle={`${filteredList.length} Membros cadastrados`}
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
      <Input.Search
        style={{ marginBottom: "1rem" }}
        onChange={({ target: { value } }) => setSearch(value)}
        placeholder="Pesquisar..."
      />
      <Table
        dataSource={filteredList}
        rowKey={(row) => row.id}
        loading={loading}
      >
        <Table.Column<Usuario> title="Codigo" dataIndex="codigo" key="codigo" />
        <Table.Column<Usuario> title="Nome" dataIndex="nome" key="nome" />
        <Table.Column<Usuario>
          title="Presen??as"
          dataIndex="presecas"
          key="presecas"
          render={(_, data) => data.presencas.length}
        />
        <Table.Column<Usuario>
          key="actions"
          render={(_, membro) => (
            <Space>
              <Tooltip title="Editar">
                <Button
                  icon={<EditOutlined />}
                  type="text"
                  onClick={() => {
                    methods.reset({ ...membro });
                    setOpen(true);
                  }}
                />
              </Tooltip>
              {usuario?.funcao === "administrador" && (
                <Popconfirm
                  title="Deseja realmente excluir?"
                  icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  onConfirm={() => handleDelete(membro.id)}
                >
                  <Button icon={<DeleteOutlined />} type="text" />
                </Popconfirm>
              )}
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

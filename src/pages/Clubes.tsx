import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Avatar,
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
import Clube from "../components/Drawer/Clube";
import { useAuth } from "../hooks/useAuth";
import useRouter from "../hooks/useRoute";
import { MINIO_URL } from "../util/constants";

function Clubes() {
  const { socket, usuario } = useAuth();
  const { navigate } = useRouter();
  const methods = useForm();
  const [clubes, setClubes] = useState<Clube[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const filteredList =
    search.length > 0
      ? clubes.filter((clube) => clube.nome.includes(search.toUpperCase()))
      : clubes;

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
      <Input.Search
        style={{ marginBottom: "1rem" }}
        onChange={({ target: { value } }) => setSearch(value)}
        placeholder="Pesquisar..."
      />
      <Table
        dataSource={filteredList}
        rowKey={(row) => row.id}
        pagination={{ pageSize: 7 }}
        loading={loading}
      >
        <Table.Column<Clube>
          title="Nome"
          dataIndex="nome"
          key="nome"
          render={(_, data) => (
            <Space>
              {data.logo && (
                <Avatar size={64} src={`${MINIO_URL}${data.logo}`} />
              )}
              {data.nome}
            </Space>
          )}
        />
        <Table.Column<Clube> title="País" dataIndex="pais" key="pais" />
        <Table.Column<Clube> title="Cidade" dataIndex="regiao" key="regiao" />
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
              {usuario?.funcao === "administrador" && (
                <Popconfirm
                  title="Deseja realmente excluir?"
                  icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  onConfirm={() => handleDelete(clube.id)}
                >
                  <Button icon={<DeleteOutlined />} type="text" />
                </Popconfirm>
              )}
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

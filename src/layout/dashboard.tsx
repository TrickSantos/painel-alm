import { Layout, Menu } from "antd";
import { Navigate, Outlet } from "react-router-dom";
import useRouter from "../hooks/useRoute";

const { Header, Content, Sider } = Layout;
type Props = {
  usuario: Usuario | null;
  redirectPath?: string;
};
function Dashboard({ usuario, redirectPath = "/login" }: Props) {
  const { navigate } = useRouter();

  if (!usuario) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <Layout style={{ height: "100vh" }}>
      <Header>
        <p>Logo</p>
      </Header>
      <Layout>
        <Sider theme="light">
          <Menu>
            <Menu.Item key="clubes" onClick={() => navigate("clube")}>
              Clubes
            </Menu.Item>
            <Menu.Item key="eventos" onClick={() => navigate("evento")}>
              Eventos
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ padding: "1rem" }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Dashboard;

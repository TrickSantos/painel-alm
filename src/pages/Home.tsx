import { Button, Input, Row } from "antd";
import { useAuth } from "../hooks/useAuth";
import S from "./styles";

function Home() {
  const { login } = useAuth();

  return (
    <S.Container>
      <S.LoginCard xxl={5} xl={7} lg={10} md={12} xs={22}>
        <S.LoginForm>
          <S.Label>Email:</S.Label>
          <Input size="large" />
          <S.Label>Senha:</S.Label>
          <Input.Password size="large" />
          <Button block type="primary" size="large" onClick={login}>
            Entrar
          </Button>
        </S.LoginForm>
      </S.LoginCard>
    </S.Container>
  );
}

export default Home;

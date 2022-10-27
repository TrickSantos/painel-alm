import { Button, Input } from "antd";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import S from "./styles";

function Home() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    await login(email, password);
  };

  return (
    <S.Container>
      <S.LoginCard xxl={5} xl={7} lg={10} md={12} xs={22}>
        <S.LoginForm>
          <S.Label>Email:</S.Label>
          <Input
            size="large"
            type="email"
            onChange={({ target: { value } }) => setEmail(value)}
            value={email}
          />
          <S.Label>Senha:</S.Label>
          <Input.Password
            size="large"
            onChange={({ target: { value } }) => setPassword(value)}
            value={password}
          />
          <Button block type="primary" size="large" onClick={onLogin}>
            Entrar
          </Button>
        </S.LoginForm>
      </S.LoginCard>
    </S.Container>
  );
}

export default Home;

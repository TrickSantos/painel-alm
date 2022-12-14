import { Col } from "antd";
import styled from "styled-components";
import bg from "../assets/bg.png";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const ContainerGrafico = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-image: url(${bg});
`;

const Evento = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
  background-color: #f3f3fc;
`;

const LoginCard = styled(Col)`
  background-color: #fff;
  padding: 3em;
  box-shadow: 0px 10px 20px -5px rgba(77, 51, 4, 0.25),
    0px 0px 80px -10px rgba(77, 51, 4, 0.4);
  border-radius: 15px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
`;

const PopImage = styled.div`
  height: 100%;
  width: auto;
  margin: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default {
  Container,
  LoginForm,
  LoginCard,
  Label,
  PopImage,
  Evento,
  ContainerGrafico,
};

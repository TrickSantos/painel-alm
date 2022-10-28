import styled from "styled-components";

type container = {
  width: number;
};

const Container = styled.div<container>`
  max-width: 70%;
  width: ${(props) => props.width}%;
  transition: width 1s;
`;

const Image = styled.img`
  object-fit: contain;
  height: auto;
  width: 90%;
  margin-top: 20;
`;

export default { Container, Image };

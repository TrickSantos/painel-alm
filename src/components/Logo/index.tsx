import Style from "./style";

type Props = {
  logo: string;
  porcentagem: number;
};

export default function Logo({ logo, porcentagem }: Props) {
  return (
    <Style.Container width={porcentagem}>
      <Style.Image src={logo} alt="" />
    </Style.Container>
  );
}

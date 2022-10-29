import { useEffect, useState } from "react";
import S from "./styles";
import aventureiros from "../assets/aventureiros.png";
import { useAuth } from "../hooks/useAuth";
import useRouter from "../hooks/useRoute";
import { MINIO_URL, SECONDS } from "../util/constants";
import { ResponsiveBar } from "@nivo/bar";
import { animated, useTransition } from "react-spring";
import Fireworks from "@fireworks-js/react";
import { Typography } from "antd";

type Presencas = {
  id: number;
  logo?: string;
  nome: string;
  porcentagem: number;
};

const Image = ({ bars }: any) => {
  let images = bars.map(({ key, x, y, width, height, data: { data } }: any) => {
    return (
      <>
        <image
          key={key}
          xlinkHref={data.logo ? `${MINIO_URL}${data.logo}` : aventureiros}
          x={x + width / 2 - width / 2}
          y={y + height / 2 - width}
          height={width}
          width={width}
        />
        <text
          key={data.nome}
          x={x + width / 2.5}
          y={y - 20 + height / 2 - width}
          textAnchor="center"
          dominantBaseline="central"
          style={{
            fontFamily: "sans-serif",
            fontSize: 20,
            fill: "rgb(154, 136, 84)",
            pointerEvents: "none",
          }}
        >{`${data.porcentagem | 0}%`}</text>
      </>
    );
  });
  return <g>{images}</g>;
};

export default function Presencas() {
  const { socket } = useAuth();
  const { params } = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [ganhador, setGanhador] = useState<Clube | null>(null);

  const transition = useTransition(isVisible, {
    from: { x: -100, y: 800, opacity: 0 },
    enter: { x: 0, y: 0, opacity: 1 },
    leave: { x: 100, y: 800, opacity: 0 },
  });
  const [presencas, setPresencas] = useState<Presencas[]>([]);

  useEffect(() => {
    socket.emit(
      "presenca:getPresences",
      Number(params.id),
      (res: Presencas[]) => {
        const clubes = res.filter((clube) => {
          if (clube.porcentagem === 100) {
            return false;
          }
          if (clube.porcentagem > 0) {
            return true;
          }
        });
        setPresencas(clubes);
      }
    );
    socket.on("presenca:created", () => {
      socket.emit(
        "presenca:getPresences",
        Number(params.id),
        async (res: Presencas[]) => {
          const clubes = res.filter((clube) => {
            if (clube.porcentagem === 100) {
              return false;
            }
            if (clube.porcentagem > 0) {
              return true;
            }
          });
          setPresencas(clubes);
        }
      );
    });
    socket.on("ganhador", (data) => {
      setGanhador(data);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 10 * SECONDS);
    });
  }, []);

  return (
    <>
      {isVisible ? (
        <S.Container>
          <S.PopImage>
            {transition((style, item) =>
              item ? (
                <>
                  <Fireworks
                    options={{
                      rocketsPoint: {
                        min: 0,
                        max: 100,
                      },
                      opacity: 0.7,
                    }}
                    style={{
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      position: "fixed",
                      background: "#FFF",
                    }}
                  />
                  {ganhador && (
                    <animated.img
                      style={{
                        ...style,
                        objectFit: "contain",
                        height: "auto",
                        width: "50%",
                        marginTop: 20,
                        zIndex: 1,
                      }}
                      src={
                        ganhador.logo
                          ? `${MINIO_URL}${ganhador?.logo}`
                          : aventureiros
                      }
                    />
                  )}
                  <animated.div
                    style={{
                      ...style,
                      zIndex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography.Title level={2}>
                      {ganhador?.nome}
                    </Typography.Title>
                  </animated.div>
                </>
              ) : null
            )}
          </S.PopImage>
        </S.Container>
      ) : (
        <ResponsiveBar
          data={presencas}
          layout="vertical"
          indexBy="nome"
          keys={["porcentagem"]}
          colors={{ scheme: "set3" }}
          colorBy="indexValue"
          label={(v) => `${v.data.nome}: ${v.data.porcentagem | 0}%`}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.4]] }}
          maxValue={100}
          minValue={0}
          animate
          theme={{
            fontSize: 20,
          }}
          labelSkipWidth={400}
          layers={[
            "grid",
            "axes",
            "bars",
            "markers",
            "legends",
            "annotations",
            Image,
          ]}
        />
      )}
    </>
  );
}

{
  /* <S.Evento ref={parent}>
  {presencas.map((clube) => (
    <Logo
    key={clube.id}
    logo={clube.logo ? `${MINIO_URL}${clube.logo}` : aventureiros}
    porcentagem={clube.porcentagem}
    />
  ))}
</S.Evento>; */
}

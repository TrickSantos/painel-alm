import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useAuth } from "../hooks/useAuth";
import useRouter from "../hooks/useRoute";
import { sleep } from "../util/sleep";
import { SECONDS } from "../util/constants";

type Props = {};

type Presencas = {
  id: number;
  logo?: string;
  nome: string;
  _count: {
    presentes: number;
    membros: number;
  };
};

type DatumPresencas = {
  nome: string;
  porcentagem: number;
};

export default function Presencas({}: Props) {
  const { socket } = useAuth();
  const { params } = useRouter();
  const [presencas, setPresencas] = useState<DatumPresencas[]>([]);
  const [completos, setCompletos] = useState<Presencas[]>([]);

  useEffect(() => {
    socket.emit(
      "presenca:getPresences",
      Number(params.id),
      (res: Presencas[]) => {
        const a = res.map((clube) => ({
          nome: clube.nome,
          porcentagem: Math.floor(
            (clube._count.presentes / clube._count.membros) * 100
          ),
        }));
        setPresencas(a.sort((a, b) => a.porcentagem - b.porcentagem));
      }
    );
    socket.on("presenca:created", () => {
      socket.emit(
        "presenca:getPresences",
        Number(params.id),
        async (res: Presencas[]) => {
          let clubesCompletos: Presencas[] = [];
          const a = res.map((clube) => {
            let porcentagem = Math.floor(
              (clube._count.presentes / clube._count.membros) * 100
            );

            if (porcentagem === 100) {
              clubesCompletos.push(clube);
            }

            return {
              nome: clube.nome,
              porcentagem,
            };
          });
          setPresencas(a.sort((a, b) => a.porcentagem - b.porcentagem));

          if (clubesCompletos.length > 0) {
            if (completos.toString() !== clubesCompletos.toString()) {
              const novo = clubesCompletos.filter(
                (c) => !completos.includes(c)
              );
              setCompletos(clubesCompletos);
              if (novo.length > 1) {
                novo.forEach(async (n) => {
                  await sleep(2 * SECONDS);
                  socket.emit("ganhador", n);
                });
              } else {
                socket.emit("ganhador", novo[0]);
              }
            }
          }
        }
      );
    });
  }, []);

  return (
    <ResponsiveBar
      data={presencas}
      layout="horizontal"
      indexBy="nome"
      keys={["porcentagem"]}
      colors={{ scheme: "spectral" }}
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
        ({ bars, labelSkipWidth }) => (
          <g>
            {bars.map(({ width, height, y, data: { data } }) => {
              // only show this custom outer label on bars that are too small
              return width < labelSkipWidth ? (
                <text
                  transform={`translate(${width + 10}, ${y + height / 2})`}
                  text-anchor="left"
                  dominant-baseline="central"
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: 20,
                    fill: "rgb(154, 136, 84)",
                    pointerEvents: "none",
                  }}
                >{`${data.nome}: ${data.porcentagem | 0}%`}</text>
              ) : null;
            })}
          </g>
        ),
      ]}
    />
  );
}

import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useAuth } from "../hooks/useAuth";
import useRouter from "../hooks/useRoute";

type Props = {};

type Presencas = {
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

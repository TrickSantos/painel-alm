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
        console.log(a);
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
          console.log(a);
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
    />
  );
}

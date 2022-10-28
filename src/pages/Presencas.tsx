import { useEffect, useState } from "react";
import S from "./styles";
import aventureiros from "../assets/aventureiros.png";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useAuth } from "../hooks/useAuth";
import useRouter from "../hooks/useRoute";
import Logo from "../components/Logo";
import { MINIO_URL } from "../util/constants";

type Presencas = {
  id: number;
  logo?: string;
  nome: string;
  porcentagem: number;
};

export default function Presencas() {
  const { socket } = useAuth();
  const { params } = useRouter();
  const [parent] = useAutoAnimate<HTMLDivElement>();
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
  }, []);

  return (
    <S.Evento ref={parent}>
      {presencas.map((clube) => (
        <Logo
          key={clube.id}
          logo={clube.logo ? `${MINIO_URL}${clube.logo}` : aventureiros}
          porcentagem={clube.porcentagem}
        />
      ))}
    </S.Evento>
  );
}

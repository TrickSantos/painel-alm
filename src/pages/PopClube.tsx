import { Typography } from "antd";
import { useTransition, animated } from "react-spring";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { MINIO_URL, SECONDS } from "../util/constants";
import S from "./styles";
import aventuri from "../assets/aventuri.png";

function PopClube() {
  const { socket } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [ganhador, setGanhador] = useState<Clube | null>(null);

  const transition = useTransition(isVisible, {
    from: { x: -100, y: 800, opacity: 0 },
    enter: { x: 0, y: 0, opacity: 1 },
    leave: { x: 100, y: 800, opacity: 0 },
  });

  useEffect(() => {
    socket.on("ganhador", (data) => {
      setGanhador(data);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 10 * SECONDS);
    });
  }, []);

  return (
    <S.Container>
      <S.PopImage>
        {isVisible ? (
          transition((style, item) =>
            item ? (
              <>
                {ganhador && ganhador.logo && (
                  <animated.img
                    style={{
                      ...style,
                      objectFit: "contain",
                      height: "auto",
                      width: "90%",
                    }}
                    src={`${MINIO_URL}${ganhador?.logo}`}
                  />
                )}
                <animated.div style={style}>
                  <Typography.Title level={2}>
                    {ganhador?.nome}
                  </Typography.Title>
                </animated.div>
              </>
            ) : null
          )
        ) : (
          <img
            style={{
              objectFit: "contain",
              height: "100%",
              width: "100%",
            }}
            src={aventuri}
          />
        )}
      </S.PopImage>
    </S.Container>
  );
}

export default PopClube;

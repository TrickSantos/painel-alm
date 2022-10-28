import { Typography } from "antd";
import { useTransition, animated } from "react-spring";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { MINIO_URL, SECONDS } from "../util/constants";
import S from "./styles";
import aventuri from "../assets/aventuri.png";
import { Fireworks } from "@fireworks-js/react";
import aventureiros from "../assets/aventureiros.png";

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
      setTimeout(() => setIsVisible(false), 20 * SECONDS);
    });
  }, []);

  return (
    <S.Container>
      <S.PopImage>
        {isVisible ? (
          transition((style, item) =>
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

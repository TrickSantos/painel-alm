import {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import useRouter from "../hooks/useRoute";

type Props = {
  children: ReactElement;
};

interface AuthenticatationData {
  usuario: Usuario | null;
  setUsuario: Dispatch<SetStateAction<Usuario | null>>;
  login: () => void;
  socket: Socket;
  signed: boolean;
}

const TOKEN_API = "TOKEN_API";
const STORAGE_USER = "STORAGE_USER";
const storageToken = localStorage.getItem(TOKEN_API);
const storageUser = localStorage.getItem(STORAGE_USER);

export const AuthenticationContext = createContext<AuthenticatationData>(
  {} as AuthenticatationData
);

function AuthtenticationProvider({ children }: Props) {
  const [usuario, setUsuario] = useState<Usuario | null>(
    storageUser ? JSON.parse(storageUser) : null
  );
  const [token, setToken] = useState(storageToken);
  const socket = io("ws://localhost:3333", {
    autoConnect: false,
    auth: { token },
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  });
  const { navigate } = useRouter();

  useEffect(() => {
    socket.connect();
    socket.on("exception", (res) => {
      if (res.message === "Forbidden resource") {
        localStorage.clear();
        setToken(null);
        setUsuario(null);
        navigate("/login");
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  useEffect(() => {
    const storageUser = localStorage.getItem(STORAGE_USER);
    const storageToken = localStorage.getItem(TOKEN_API);

    if (storageToken && storageUser) {
      socket.disconnect();
      socket.auth = { token: storageToken };
      socket.connect();
    }
  }, [socket, token]);

  const login = () => {
    socket.emit(
      "login",
      {
        email: "patrick.tafa@gmail.com",
        password: "trick123",
      },
      (res: any) => {
        localStorage.setItem(STORAGE_USER, JSON.stringify(res.usuario));
        localStorage.setItem(TOKEN_API, res.token);

        setToken(res.token);
        setUsuario(res.usuario);
        navigate("/clube");
      }
    );
  };

  return (
    <AuthenticationContext.Provider
      value={{
        signed: !!usuario,
        usuario,
        setUsuario,
        login,
        socket,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export default AuthtenticationProvider;

import { BrowserRouter } from "react-router-dom";
import AuthtenticationProvider from "./contexts/Authtentication";
import Pages from "./pages";
import dayjs from "./services/dayjs";

dayjs.tz.setDefault("America/Cuiaba");

function App() {
  return (
    <BrowserRouter>
      <AuthtenticationProvider>
        <Pages />
      </AuthtenticationProvider>
    </BrowserRouter>
  );
}

export default App;

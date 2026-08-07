import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { ThemeProvider } from "./context/ThemeContext";

import AppRoutes from "./routes/AppRoutes";

import useOnlineStatus from "./hooks/useOnlineStatus";
import OfflineBanner from "./components/common/OfflineBanner";

function App() {
  const online = useOnlineStatus();

  console.log("ONLINE =", online);   // 👈 ADD THIS

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ChatProvider>

            {!online && <OfflineBanner />}

            <AppRoutes />

          </ChatProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
export default App;
// Reciclaí — App Router
// Reciclaí — Shell global com acessibilidade integrada
// Design: Floresta Tecnológica, controles inclusivos e foco visível em todas as rotas.
// Neo-Natureza Minimalista Design System
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BluetoothProvider } from "./contexts/BluetoothContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import AccessibilityPanel from "./components/AccessibilityPanel";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Scanner from "./pages/Scanner";
import Search from "./pages/Search";
import MaterialDetail from "./pages/MaterialDetail";
import MapPage from "./pages/MapPage";
import QuickBin from "./pages/QuickBin";
import Education from "./pages/Education";
import Profile from "./pages/Profile";
import BluetoothConnection from "./pages/BluetoothConnection";
import ScannerBluetooth from "./pages/ScannerBluetooth";
import ScannerEAN from "./pages/ScannerEAN";

function ProtectedRouter() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/scanner" component={Scanner} />
      <Route path="/pesquisa" component={Search} />
      <Route path="/material/:id" component={MaterialDetail} />
      <Route path="/mapa" component={MapPage} />
      <Route path="/qual-lixo" component={QuickBin} />
      <Route path="/educacao" component={Education} />
      <Route path="/perfil" component={Profile} />
      <Route path="/bluetooth" component={BluetoothConnection} />
      <Route path="/scanner-bluetooth" component={ScannerBluetooth} />
      <Route path="/scanner-ean" component={ScannerEAN} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider defaultTheme="light">
          <AccessibilityProvider>
            <BluetoothProvider>
              <TooltipProvider>
                <Toaster />
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-[#006633] focus:px-4 focus:py-3 focus:font-bold focus:text-white focus:shadow-lg"
                >
                  Pular para o conteúdo principal
                </a>
                <main id="main-content" tabIndex={-1}>
                  <ProtectedRouter />
                </main>
                <AccessibilityPanel />
              </TooltipProvider>
            </BluetoothProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NavigatorLesson from "./pages/NavigatorLesson";
import NavigatorDemo from "./pages/NavigatorDemo";
import TroubleshootingDemo from "./pages/TroubleshootingDemo";
import PerformanceLab from "./pages/PerformanceLab";
import WebLctReplica from "./pages/WebLctReplica";

/**
 * Design reminder — Field Control Room: the whole application maintains a precise,
 * operational-console aesthetic with a dark equipment-room base and signal-aqua verification states.
 */

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/weblct-v200r021-training"} component={WebLctReplica} />
      <Route path={"/performance-lab"} component={PerformanceLab} />
      <Route path={"/troubleshooting-demo"} component={TroubleshootingDemo} />
      <Route path={"/navigator-demo"} component={NavigatorDemo} />
      <Route path={"/navigator"} component={NavigatorLesson} />
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

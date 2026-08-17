import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { TrainingProgressProvider } from "./contexts/TrainingProgressContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NavigatorLesson from "./pages/NavigatorLesson";
import NavigatorDemo from "./pages/NavigatorDemo";
import TroubleshootingDemo from "./pages/TroubleshootingDemo";
import PerformanceLab from "./pages/PerformanceLab";
import WebLctReplica from "./pages/WebLctReplica";
import BrowseAlarms from "./pages/BrowseAlarms";
import WebLctPerformance52121927 from "./pages/WebLctPerformance52121927";
import WebLctAlarms2121921 from "./pages/WebLctAlarms2121921";
import Rtn950aLinkLab from "./pages/Rtn950aLinkLab";
import Rtn950aSlotLayout from "./pages/Rtn950aSlotLayout";
import Rtn950NeAttributeLab from "./pages/Rtn950NeAttributeLab";
import Rtn950ElanVlanLab from "./pages/Rtn950ElanVlanLab";
import RtnProtectionHsbLab from "./pages/RtnProtectionHsbLab";

/**
 * Design reminder — Field Control Room: the whole application maintains a precise,
 * operational-console aesthetic with a dark equipment-room base and signal-aqua verification states.
 */

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/weblct-v200r021-training"} component={WebLctReplica} />
      <Route path={"/weblct-v200r021-alarms"} component={WebLctAlarms2121921} />
      <Route path={"/weblct-reference-2121921-alarms"} component={WebLctAlarms2121921} />
      <Route path={"/weblct-reference-52121927"} component={WebLctPerformance52121927} />
      <Route path={"/rtn950a-link-lab"} component={Rtn950aLinkLab} />
      <Route path={"/rtn950a-slot-layout"} component={Rtn950aSlotLayout} />
      <Route path={"/rtn950-ne-attribute-lab"} component={Rtn950NeAttributeLab} />
      <Route path={"/rtn950-elan-vlan-lab"} component={Rtn950ElanVlanLab} />
      <Route path={"/protection-hsb-lab"} component={RtnProtectionHsbLab} />
      <Route path={"/performance-lab"} component={PerformanceLab} />
      <Route path={"/troubleshooting-demo"} component={TroubleshootingDemo} />
      <Route path={"/navigator-demo"} component={NavigatorDemo} />
      <Route path={"/navigator"} component={NavigatorLesson} />
      <Route path={"/course-roadmap"} component={Home} />
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
        <TrainingProgressProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </TrainingProgressProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

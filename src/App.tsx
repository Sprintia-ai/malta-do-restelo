import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/archive/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Members from "./pages/Members";
import Photos from "./pages/Photos";
import Archive from "./pages/Archive";
import HistoricalArchive from "./pages/HistoricalArchive";
import NextEvent from "./pages/NextEvent";
import Event from "./pages/Event";
import Event2025 from "./pages/Event2025";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster theme="dark" position="bottom-center" richColors />
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/membros" element={<Members />} />
          <Route path="/fotografias" element={<Photos />} />
          <Route path="/historico" element={<HistoricalArchive />} />
          <Route path="/arquivo" element={<Archive />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/proximo-almoco" element={<NextEvent />} />
          <Route path="/almoco-2025" element={<Event2025 />} />
          <Route path="/almoco/:year" element={<Event />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

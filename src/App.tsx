import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";
import AppLayout from "./components/AppLayout.tsx";
import Home from "./pages/app/Home.tsx";
import Bible from "./pages/app/Bible.tsx";
import Predications from "./pages/app/Predications.tsx";
import Journal from "./pages/app/Journal.tsx";
import Messages from "./pages/app/Messages.tsx";
import Profil from "./pages/app/Profil.tsx";
import Bibliotheque from "./pages/app/Bibliotheque.tsx";
import BookReader from "./pages/app/BookReader.tsx";
import PredicationPlayer from "./pages/app/PredicationPlayer.tsx";
import NoteEditor from "./pages/app/NoteEditor.tsx";
import Contacts from "./pages/app/Contacts.tsx";
import ContactProfile from "./pages/app/ContactProfile.tsx";
import NewConversation from "./pages/app/NewConversation.tsx";
import CallAudio from "./pages/app/CallAudio.tsx";
import CallVideo from "./pages/app/CallVideo.tsx";
import AdminDashboard from "./pages/app/AdminDashboard.tsx";
import CreatorDashboard from "./pages/app/CreatorDashboard.tsx";
import Downloads from "./pages/app/Downloads.tsx";
import Subscription from "./pages/app/Subscription.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="bible" element={<Bible />} />
            <Route path="predications" element={<Predications />} />
            <Route path="predications/:id" element={<PredicationPlayer />} />
            <Route path="bibliotheque" element={<Bibliotheque />} />
            <Route path="bibliotheque/:id" element={<BookReader />} />
            <Route path="journal" element={<Journal />} />
            <Route path="journal/new" element={<NoteEditor />} />
            <Route path="journal/:id" element={<NoteEditor />} />
            <Route path="messages" element={<Messages />} />
            <Route path="messages/new" element={<NewConversation />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="contacts/:id" element={<ContactProfile />} />
            <Route path="call/audio/:id" element={<CallAudio />} />
            <Route path="call/video/:id" element={<CallVideo />} />
            <Route path="downloads" element={<Downloads />} />
            <Route path="abonnement" element={<Subscription />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="creator" element={<CreatorDashboard />} />
            <Route path="profil" element={<Profil />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

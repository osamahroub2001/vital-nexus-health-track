
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from "@/components/ui/toaster"

// Make sure we have a valid root element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Create React root and render app
createRoot(rootElement).render(
  <>
    <App />
    <Toaster />
  </>
);

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
const stripePromise = loadStripe("pk_test_51SiKXZFXIrXBUycwuJDZN21XtfhuqNinoNl5mR62qyXEfdz4MjyyXoEoaEkYm52gXVEwLwENCvhKExVteSvHUzV3008bi24qzH");

createRoot(document.getElementById('root')).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>


)

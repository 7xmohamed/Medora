import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import './index.css'
import App from './App'

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true
});

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
axios.defaults.withCredentials = true

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routers/router.jsx'
import  'sweetalert2/dist/sweetalert2.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/i18n.js'; // Import i18n configuration
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { HelmetProvider } from "react-helmet-async";


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <HelmetProvider>
    <RouterProvider router={router} />
    </HelmetProvider>
  </Provider>,
)

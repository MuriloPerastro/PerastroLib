import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import { BibliotecaProvider } from './context/BibliotecaContext'
import ErrorBoundary from './components/ErrorBoundary'

import './styles/global.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>

        <ErrorBoundary>

            <BibliotecaProvider>

                <HashRouter>

                    <App />

                </HashRouter>

            </BibliotecaProvider>

        </ErrorBoundary>
        
    </StrictMode>,
)
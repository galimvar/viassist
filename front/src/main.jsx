import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { AuthProvider } from './context/AuthContext.jsx';
import { BeneficiaireProvider } from './context/BeneficiaireContext.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				{/* À l'intérieur d'AuthProvider : il a besoin de savoir qui est connecté */}
				<BeneficiaireProvider>
					<App />
				</BeneficiaireProvider>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>,
);

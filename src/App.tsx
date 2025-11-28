import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Calculadora from './pages/Calculadora';
import Resultado from './pages/Resultado';
import Produtos from './pages/Produtos';
import Historico from './pages/Historico';
import Clientes from './pages/Clientes';
import Custos from './pages/Custos';
import ValidacaoCalculos from './pages/ValidacaoCalculos';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calculadora" element={<Calculadora />} />
            <Route path="/resultado" element={<Resultado />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/custos" element={<Custos />} />
            <Route path="/validacao" element={<ValidacaoCalculos />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;


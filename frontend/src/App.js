import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import CandidatosList from './components/CandidatosList';
import CandidatoForm from './components/CandidatoForm';
import ExperienciaLaboral from './components/ExperienciaLaboral';
import Login from './components/Login';
import Competencias from './components/Competencias';
import Idiomas from './components/Idiomas';
import Capacitaciones from './components/Capacitaciones';
import Puestos from './components/Puestos';
import PanelRH from './components/PanelRH';
import DetallePersona from './components/DetallePersona';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Sistema de Reclutamiento
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Candidatos
            </Button>
            {isAuthenticated && (
              <>
                <Button color="inherit" component={Link} to="/competencias">
                  Competencias
                </Button>
                <Button color="inherit" component={Link} to="/idiomas">
                  Idiomas
                </Button>
                <Button color="inherit" component={Link} to="/capacitaciones">
                  Capacitaciones
                </Button>
                <Button color="inherit" component={Link} to="/puestos">
                  Puestos
                </Button>
                <Button color="inherit" component={Link} to="/admin">
                  Panel RH
                </Button>
              </>
            )}
            <Button 
              color="inherit" 
              component={Link} 
              to={isAuthenticated ? "/" : "/login"}
              onClick={isAuthenticated ? handleLogout : undefined}
            >
              {isAuthenticated ? 'Cerrar Sesión' : 'Iniciar Sesión'}
            </Button>
          </Toolbar>
        </AppBar>

        <Container style={{ marginTop: '2rem' }}>
          <Routes>
            <Route path="/" element={<CandidatosList isAuthenticated={isAuthenticated} />} />
            <Route path="/candidato/nuevo" element={<CandidatoForm />} />
            <Route path="/experiencia/:id" element={<ExperienciaLaboral />} />
            <Route path="/detalle/:type/:id" element={<DetallePersona />} />
            <Route path="/candidato/detalle/:id" element={<DetallePersona />} />
            <Route path="/empleado/detalle/:id" element={<DetallePersona />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/competencias" element={<Competencias />} />
            <Route path="/idiomas" element={<Idiomas />} />
            <Route path="/capacitaciones" element={<Capacitaciones />} />
            <Route path="/puestos" element={<Puestos />} />
            <Route path="/admin" element={<PanelRH />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  IconButton,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Work as WorkIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CandidatosList = ({ isAuthenticated }) => {
  const [candidatos, setCandidatos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidatos();
  }, []);

  const fetchCandidatos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/candidatos');
      setCandidatos(response.data);
    } catch (error) {
      console.error('Error al cargar candidatos:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este candidato?')) {
      try {
        await axios.delete(`http://localhost:3000/api/candidatos/${id}`);
        fetchCandidatos();
      } catch (error) {
        console.error('Error al eliminar candidato:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Gestión de Candidatos
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
                Lista completa de candidatos registrados
              </Typography>
            </Box>
            <Button
              onClick={() => navigate('/candidato/nuevo')}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ 
                bgcolor: 'white',
                color: 'primary.main',
                borderRadius: 2,
                px: 3,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 'bold',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              Nuevo Candidato
            </Button>
          </Box>
        </Paper>

        <Box sx={{ mb: 4 }}>
          <Card elevation={2} sx={{ bgcolor: 'grey.50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Total de Candidatos: {candidatos.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Card elevation={3}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      Nombre
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      Cédula
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      Puesto Aspirado
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      Departamento
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      Competencias
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      Salario Aspirado
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }} align="center">
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {candidatos.map((candidato) => (
                    <TableRow 
                      key={candidato.id}
                      hover
                      sx={{ '&:hover': { bgcolor: 'grey.50' } }}
                    >
                      <TableCell sx={{ fontSize: '0.95rem', fontWeight: '500' }}>
                        {candidato.nombre}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.95rem' }}>
                        {candidato.cedula}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={candidato.puesto_aspira || 'No especificado'}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.95rem' }}>
                        {candidato.departamento}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        {candidato.competencias && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {candidato.competencias.split(', ').slice(0, 2).map((comp, index) => (
                              <Chip 
                                key={index}
                                label={comp}
                                size="small"
                                color="secondary"
                                variant="outlined"
                                onClick={() => {}}
                              />
                            ))}
                            {candidato.competencias.split(', ').length > 2 && (
                              <Chip 
                                label={`+${candidato.competencias.split(', ').length - 2}`}
                                size="small"
                                color="default"
                                variant="outlined"
                                onClick={() => {}}

                              />
                            )}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.95rem', fontWeight: '500' }}>
                        ${candidato.salario_aspira?.toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Button
                            onClick={() => navigate(`/detalle/candidato/${candidato.id}`)}
                            variant="contained"
                            color="info"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            sx={{ 
                              borderRadius: 2,
                              textTransform: 'none',
                              fontSize: '0.8rem'
                            }}
                          >
                            Ver Detalles
                          </Button>
                          <Button
                            onClick={() => navigate(`/experiencia/${candidato.id}`)}
                            variant="outlined"
                            size="small"
                            startIcon={<WorkIcon />}
                            sx={{ 
                              borderRadius: 2,
                              textTransform: 'none',
                              fontSize: '0.8rem'
                            }}
                          >
                            Experiencia
                          </Button>
                          {isAuthenticated && (
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(candidato.id)}
                              sx={{ 
                                '&:hover': { 
                                  bgcolor: 'error.light',
                                  color: 'white'
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {candidatos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          No hay candidatos registrados
                        </Typography>
                        <Button
                          onClick={() => navigate('/candidato/nuevo')}
                          variant="contained"
                          startIcon={<AddIcon />}
                          sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}
                        >
                          Agregar Primer Candidato
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default CandidatosList; 
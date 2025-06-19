-- Tabla para la relación entre candidatos y capacitaciones
CREATE TABLE capacitaciones_candidatos (
    id SERIAL PRIMARY KEY,
    candidato_id INTEGER REFERENCES candidatos(id) ON DELETE CASCADE,
    descripcion VARCHAR(255) NOT NULL,
    nivel VARCHAR(50) NOT NULL,
    fecha_desde DATE NOT NULL,
    fecha_hasta DATE,
    institucion VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Datos de ejemplo para la tabla candidatos
INSERT INTO candidatos (nombre, cedula, fecha_nacimiento, puesto_aspira, departamento, salario_aspira, competencias_principales, recomendado_por) VALUES
('Juan Pérez', '001-1234567-8', '1990-05-15', 'Desarrollador Senior', 'Tecnología', 80000, 'JavaScript, React, Node.js', 'María Rodríguez'),
('Ana García', '402-9876543-1', '1988-08-22', 'Analista de Recursos Humanos', 'Recursos Humanos', 65000, 'Gestión de personal, Reclutamiento, Capacitación', 'Carlos Martínez'),
('Roberto Sánchez', '402-4567890-2', '1992-03-10', 'Contador', 'Finanzas', 70000, 'Contabilidad, Auditoría, Impuestos', 'Laura Fernández'),
('María López', '402-3456789-3', '1995-11-30', 'Diseñadora Gráfica', 'Marketing', 60000, 'Photoshop, Illustrator, Diseño UI/UX', 'Pedro Gómez'),
('Carlos Ramírez', '402-2345678-4', '1991-07-18', 'Ingeniero de Sistemas', 'Tecnología', 75000, 'Java, Spring Boot, Microservicios', 'Ana Martínez'),
('Laura Torres', '402-3456789-5', '1993-09-25', 'Especialista en Marketing Digital', 'Marketing', 62000, 'SEO, SEM, Redes Sociales', 'Juan Pérez'),
('Miguel Rodríguez', '402-4567890-6', '1989-12-05', 'Gerente de Proyectos', 'Operaciones', 85000, 'Gestión de proyectos, Scrum, PMP', 'Roberto Sánchez'),
('Sofía Martínez', '402-5678901-7', '1994-04-12', 'Analista de Datos', 'Tecnología', 68000, 'Python, SQL, Power BI', 'Carlos Ramírez'),
('José González', '402-6789012-8', '1992-06-28', 'Especialista en Seguridad', 'Tecnología', 72000, 'Ciberseguridad, Redes, Firewalls', 'Miguel Rodríguez'),
('Patricia Díaz', '402-7890123-9', '1990-10-15', 'Asistente Administrativa', 'Administración', 45000, 'Office, Gestión documental, Atención al cliente', 'Laura Torres');

-- Datos de ejemplo para la tabla capacitaciones_candidatos
INSERT INTO capacitaciones_candidatos (candidato_id, capacitacion_id) VALUES
(1, 1), -- Juan Pérez - Desarrollo Web con React
(1, 2), -- Juan Pérez - Programación Orientada a Objetos
(2, 3), -- Ana García - Gestión de Recursos Humanos
(2, 4), -- Ana García - Liderazgo y Trabajo en Equipo
(3, 5), -- Roberto Sánchez - Contabilidad Avanzada
(4, 6), -- María López - Diseño Gráfico Digital
(5, 7), -- Carlos Ramírez - Desarrollo Backend con Java
(6, 8), -- Laura Torres - Marketing Digital
(7, 9), -- Miguel Rodríguez - Gestión de Proyectos
(8, 10); -- Sofía Martínez - Análisis de Datos

-- Datos de ejemplo para la tabla competencias_candidatos
INSERT INTO competencias_candidatos (candidato_id, competencia_id) VALUES
(1, 1), -- Juan Pérez - JavaScript
(1, 2), -- Juan Pérez - React
(1, 3), -- Juan Pérez - Node.js
(2, 4), -- Ana García - Gestión de personal
(2, 5), -- Ana García - Reclutamiento
(3, 6), -- Roberto Sánchez - Contabilidad
(3, 7), -- Roberto Sánchez - Auditoría
(4, 8), -- María López - Photoshop
(4, 9), -- María López - Illustrator
(5, 10); -- Carlos Ramírez - Java

-- Datos de ejemplo para la tabla idiomas_candidatos
INSERT INTO idiomas_candidatos (candidato_id, idioma_id) VALUES
(1, 1), -- Juan Pérez - Español
(1, 2), -- Juan Pérez - Inglés
(2, 1), -- Ana García - Español
(2, 2), -- Ana García - Inglés
(3, 1), -- Roberto Sánchez - Español
(4, 1), -- María López - Español
(4, 2), -- María López - Inglés
(5, 1), -- Carlos Ramírez - Español
(5, 2), -- Carlos Ramírez - Inglés
(6, 1); -- Laura Torres - Español 
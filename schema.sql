-- ============================================================
-- SISTEMA DE GESTIÓN DE CITAS MÉDICAS
-- Script SQL Completo
-- ============================================================

CREATE DATABASE IF NOT EXISTS medical_appointments
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE medical_appointments;

-- ============================================================
-- TABLA: usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  rol         ENUM('admin', 'medico', 'paciente') NOT NULL DEFAULT 'paciente',
  activo      TINYINT(1) NOT NULL DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: especialidades
-- ============================================================
CREATE TABLE IF NOT EXISTS especialidades (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  activo      TINYINT(1) NOT NULL DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: medicos
-- ============================================================
CREATE TABLE IF NOT EXISTS medicos (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id       INT NOT NULL,
  especialidad_id  INT NOT NULL,
  numero_licencia  VARCHAR(50) NOT NULL UNIQUE,
  telefono         VARCHAR(20),
  activo           TINYINT(1) NOT NULL DEFAULT 1,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id)      REFERENCES usuarios(id)      ON DELETE CASCADE,
  FOREIGN KEY (especialidad_id) REFERENCES especialidades(id) ON DELETE RESTRICT
);

-- ============================================================
-- TABLA: pacientes
-- ============================================================
CREATE TABLE IF NOT EXISTS pacientes (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id     INT NOT NULL,
  fecha_nac      DATE NOT NULL,
  genero         ENUM('M', 'F', 'otro') NOT NULL,
  telefono       VARCHAR(20),
  direccion      VARCHAR(255),
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLA: citas
-- ============================================================
CREATE TABLE IF NOT EXISTS citas (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id  INT NOT NULL,
  medico_id    INT NOT NULL,
  fecha_hora   DATETIME NOT NULL,
  motivo       VARCHAR(255) NOT NULL,
  estado       ENUM('programada', 'confirmada', 'cancelada', 'completada') NOT NULL DEFAULT 'programada',
  notas        TEXT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  FOREIGN KEY (medico_id)   REFERENCES medicos(id)   ON DELETE RESTRICT
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_citas_fecha    ON citas(fecha_hora);
CREATE INDEX idx_citas_estado   ON citas(estado);
CREATE INDEX idx_medicos_esp    ON medicos(especialidad_id);

-- ============================================================
-- DATOS SEMILLA
-- ============================================================

-- Admin (password: Admin123!)
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Administrador', 'admin@medical.com',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Especialidades
INSERT INTO especialidades (nombre, descripcion) VALUES
('Medicina General',   'Atención médica primaria y preventiva'),
('Cardiología',        'Diagnóstico y tratamiento de enfermedades del corazón'),
('Pediatría',          'Atención médica para niños y adolescentes'),
('Dermatología',       'Diagnóstico y tratamiento de enfermedades de la piel'),
('Neurología',         'Trastornos del sistema nervioso');

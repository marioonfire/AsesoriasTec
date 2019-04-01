CREATE DATABASE ASESORIAS;

USE ASESORIAS;

CREATE TABLE USUARIOS(
  Matricula int(11) not null Auto_Increment,
  NombredeUsuario varchar(20) not null,
  Contraseña varchar(60) not null,
  Carrera varchar(50) not null,
  Correo varchar(50) not null,
  Primary key(Matricula),
  Foreign key (Carrera) References CARRERAS(id_Carrera)
);


CREATE TABLE CARRERAS
(
  id_Carrera int(11) not null,
  Nombre varchar(50) not null,
  Primary key (id_Carrera)
);

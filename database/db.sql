create database Asesoria;
use Asesoria;

CREATE TABLE CARRERAS
(
  id_Carrera int(11) not null Auto_increment,
  Nombre varchar(50) not null,
  Primary key (id_Carrera)
);

CREATE TABLE USUARIOS(
  id_Usuario int(11) not null Auto_Increment,
  NombredeUsuario varchar(20) not null,
  matricula int(30),
  Contraseña varchar(60) not null,
  Carrera int(11) not null,
  Correo varchar(320) not null,
  Tipo varchar(20) not null,
  Kardex varchar(2083),
  foto varchar(2083),
  Primary key(id_Usuario),
  CONSTRAINT FK_Usuario_Carrera Foreign key (Carrera) References CARRERAS(id_Carrera)
);

create table Secciones
(
  id_Seccion int(11) not null auto_increment,
  Nombre varchar(50)not null,
  primary key(id_Seccion)
);

create table Asesorias
(
  id_Asesoria int(11) not null auto_increment,
  Nombre varchar(50) not null,
  Seccion int(11) not null,
  Fecha_Inicio date not null,
  Fecha_Fin date not null,
  Horario_Inicio time not null,
  Horario_Fin time not null,
  Asesor int(11),
  Estado varchar(20) not null,
  Descripcion varchar(500),
  primary key(id_Asesoria),
  CONSTRAINT FK_Asesoria_Asesor2 Foreign key (Asesor) References Usuarios(id_Usuario),
  CONSTRAINT FK_Asesoria_Secciones2 Foreign key (Seccion) References Secciones(id_Seccion)
);

create table Tareas
(
 id_Tareas int(11) not null auto_increment ,
 Asesoria int(11) not null,
 Titulo varchar(50)not null,
 Descripcion varchar(50)not null,
 primary key(id_Tareas),
 CONSTRAINT FK_Tareas_Asesoria Foreign key (Asesoria) References Asesorias(id_Asesoria) 
);

create table Tareas_Alumnos(
id_Tareas_Alumnos int(11) not null auto_increment primary key,
Tarea int(11) not null,
Alumno int(11) not null,
Archivo varchar(320)not null,
Fechar datetime not null default Current_timestamp,
 CONSTRAINT FK_Tarea_Alumnos Foreign key (Alumno) References Usuarios(id_Usuario),
 CONSTRAINT FK_Tarea_Tareas Foreign key (Tarea) References Tareas(id_Tareas)
);

create table Asesorias_Alumnos(
  id_Asesorias_Alumnos int(11)  not null auto_increment,
  Alumno int(11) not null,
  Asesoria int(11) not null,
  Fecha datetime not null default Current_timestamp,
  Calificacion int(11) null,
 primary key(id_Asesorias_Alumnos),
 CONSTRAINT FK_Asesoria_Alumnos Foreign key (Alumno) References Usuarios(id_Usuario),
  CONSTRAINT FK_Asesoria_Asesoria Foreign key (Asesoria) References Asesorias(id_Asesoria)  
);

create table solicitudes_asesor(
  id_Solicitudes int(11)  auto_increment not null,
    usuario int(11) not null,
    asesoria int(11) not null,
    fechaCreacion datetime default current_timestamp,
    fechaRespuesta datetime,
  estatus varchar(20),
    primary key(id_Solicitudes),
    constraint FK_solicitudes_usuario FOREIGN KEY (usuario) REFERENCES Usuarios(id_usuario),
    constraint FK_solicitudes_Asesoria FOREIGN KEY (asesoria) REFERENCES Asesorias(id_Asesoria)
);
alter table solicitudes_asesor add fecha_inicio time 
alter table solicitudes_asesor add fecha_fin time
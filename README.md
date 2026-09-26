# 📋 Sistema de Registro Acumulativo General DECE (2026 - 2027)

Sistema web integral para el Departamento de Consejería Estudiantil (DECE) que permite el llenado en línea del **Registro Acumulativo General**, almacenamiento seguro en base de datos, generación y descarga de **PDF oficial de 4 páginas idéntico al formato original**, y un **Panel de Administración** completo.

---

## 🚀 Inicio Rápido

### 1. Iniciar el servidor
Abre una terminal en esta carpeta y ejecuta:

```bash
npm start
```

### 2. Acceder al sistema
- **Formulario Público de Llenado:** [http://localhost:3000](http://localhost:3000)
- **Panel de Administración:** [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

### 🔑 Credenciales de Administrador por Defecto
- **Usuario:** `admin`
- **Contraseña:** `admin123`
*(Puedes cambiar la contraseña en cualquier momento desde el botón "🔑 Clave" dentro del Panel de Administración).*

---

## ✨ Características y Módulos del Sistema

### 1. Formulario Web en Línea (Usuario / Padres / Estudiantes)
- **Llenado guiado por 7 secciones organizadas:**
  1. *Datos de Identificación / Información* (con lienzo interactivo para dibujar croquis o subir imagen/mapa).
  2. *Datos Familiares* (Madre, Padre y Representante con botón de copiado rápido).
  3. *Referencias Familiares y Otros Familiares* (con cálculo automático de personas en el hogar y tabla dinámica de familiares).
  4. *Referencias Socioeconómicas* (Ingresos y Egresos con suma automática de totales, préstamos, condiciones de vivienda y servicios básicos).
  5. *Datos de Salud* (Discapacidad, porcentaje, carnet CONADIS, condiciones médicas, alergias y centros de atención).
  6. *Datos Académicos / Rendimiento Escolar* (Historial, asignaturas preferidas/dificultades, reconocimientos y actividades).
  7. *Historia Vital y Declaración de Responsabilidad* (Embarazo, nacimiento, antecedentes de salud, hábitos y firma con C.I.).
- **Auto-guardado de borrador:** Si el usuario cierra el navegador por accidente, al volver puede restaurar la información ingresada.
- **Descarga instantánea de PDF:** Al finalizar el registro, se habilita inmediatamente la descarga del documento PDF de 4 páginas con todos los datos llenados.

### 2. Generador de PDF de Alta Fidelidad (4 Páginas Exactas)
- Replica la estructura, cuadrículas, bordes, tipografía, emblema DECE y distribución de las 4 páginas del documento original.
- Incrusta el croquis dibujado o cargado.
- Marca automáticamente las casillas de verificación correspondientes.

### 3. Panel de Control Administrativo (DECE)
- **Métricas e Indicadores en Tiempo Real:** Total de registros, alumnos con discapacidad, cursos registrados.
- **Búsqueda Avanzada y Filtros:** Búsqueda en tiempo real por Nombre del estudiante, Cédula o Representante, y filtro por curso.
- **Gestión de Registros (CRUD):**
  - **Descargar PDF:** Generación y descarga con 1 clic para cualquier estudiante.
  - **Ver Vista Previa:** Visualización e impresión directa en el navegador.
  - **Editar:** Modificación integral de cualquier dato o croquis guardado.
  - **Nuevo Registro:** Creación de registros directamente desde el panel administrativo.
  - **Eliminar:** Borrado seguro de registros con ventana de confirmación.
- **Exportación de Datos:** Descarga de base de datos completa en formato Excel / CSV.

---

## 📁 Estructura del Proyecto

```
REGISTRO ACUMULATIVO/
├── data/
│   ├── records.json          # Base de datos de registros guardados
│   └── users.json            # Base de datos de usuarios y claves encriptadas
├── public/
│   ├── assets/
│   │   └── logo.svg          # Emblema oficial DECE
│   ├── css/
│   │   ├── styles.css        # Estilos modernos de la aplicación web
│   │   └── pdf-format.css    # Estilos de maquetación exacta para el PDF A4
│   ├── js/
│   │   ├── croquis.js        # Motor de dibujo de croquis en lienzo HTML5
│   │   ├── pdf-generator.js  # Motor de generación y descarga de PDF
│   │   ├── app.js            # Lógica del formulario público
│   │   └── admin.js          # Lógica del panel administrativo
│   ├── index.html            # Formulario de registro online
│   ├── admin.html            # Panel de control administrativo
│   └── login.html            # Inicio de sesión administrativo
├── database.js               # Módulo de persistencia y operaciones CRUD
├── server.js                 # Servidor Express y API REST
├── package.json              # Configuración y dependencias
└── README.md                 # Documentación del sistema
```

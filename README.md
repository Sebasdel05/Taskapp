# 🗂️ TaskApp — Full Stack (React + Node.js + MongoDB)

Aplicación de gestión de tareas construida con **React**, **Node.js/Express** y **MongoDB**, completamente conteneirizada con **Docker**.

---

## 🏗️ Arquitectura

```
taskapp/
├── backend/            # API REST con Express + Mongoose
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
├── frontend/           # SPA con React
│   ├── src/App.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── TaskApp.postman_collection.json
```

### Stack
| Capa       | Tecnología              | Puerto |
|------------|-------------------------|--------|
| Frontend   | React 18 + Nginx        | 3000   |
| Backend    | Node.js 20 + Express 4  | 5000   |
| Base datos | MongoDB 7               | 27017  |

---

## 🚀 Inicio Rápido

### Opción A — Docker (recomendado)

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/taskapp.git
cd taskapp

# 2. Levantar todos los servicios
docker-compose up --build

# 3. Abrir en el navegador
open http://localhost:3000
```

### Opción B — Local

**Backend:**
```bash
cd backend
cp .env.example .env        # editar MONGO_URI si es necesario
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

> Asegúrate de tener MongoDB corriendo localmente en el puerto 27017.

---

## 📡 API REST

Base URL: `http://localhost:5000`

| Método | Endpoint          | Descripción              |
|--------|-------------------|--------------------------|
| GET    | /health           | Estado del servidor      |
| GET    | /api/tasks        | Listar todas las tareas  |
| POST   | /api/tasks        | Crear nueva tarea        |
| GET    | /api/tasks/:id    | Obtener tarea por ID     |
| PUT    | /api/tasks/:id    | Actualizar tarea         |
| DELETE | /api/tasks/:id    | Eliminar tarea           |

### Modelo de Tarea

```json
{
  "_id": "ObjectId",
  "title": "string (requerido)",
  "description": "string",
  "completed": "boolean (default: false)",
  "priority": "low | medium | high (default: medium)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Ejemplos de request

**Crear tarea:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Revisar PR","priority":"high"}'
```

**Marcar como completada:**
```bash
curl -X PUT http://localhost:5000/api/tasks/<ID> \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

---

## 🧪 Pruebas con Postman

1. Abrir Postman → **Import**
2. Seleccionar `TaskApp.postman_collection.json`
3. La variable `{{base_url}}` apunta a `http://localhost:5000`
4. Ejecutar requests en orden: **Crear** → **Listar** → **Actualizar** → **Eliminar**
5. El `task_id` se guarda automáticamente en la variable de colección al crear

**Casos incluidos:**
- ✅ Health check
- ✅ CRUD completo
- ✅ Toggle de completado
- ✅ Error 400 (validación sin título)
- ✅ Error 404 (ID inexistente)

Usa **Collection Runner** para ejecutar todos los tests en secuencia.

---

## 🐳 Docker

### Servicios en docker-compose

```yaml
mongo    → imagen oficial mongo:7, volumen persistente
backend  → Node 20 Alpine, depende de mongo
frontend → React build + Nginx, depende de backend
```

### Comandos útiles

```bash
# Ver logs
docker-compose logs -f

# Solo backend
docker-compose up backend mongo

# Reconstruir una imagen
docker-compose build frontend

# Parar y eliminar volúmenes
docker-compose down -v
```

---

## ☁️ Subir a GitHub

```bash
# Desde la raíz del proyecto
git init
git add .
git commit -m "feat: initial full stack TaskApp"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/taskapp.git
git push -u origin main
```

> Reemplaza `TU_USUARIO` con tu usuario de GitHub.

---

## 📝 Notas de Desarrollo

- Las variables de entorno sensibles van en `.env` (incluido en `.gitignore`)
- El frontend usa Nginx como proxy inverso hacia el backend en producción
- MongoDB persiste los datos en el volumen Docker `mongo_data`
- Los tests de Postman incluyen scripts de validación automática

---

*Proyecto educativo Full Stack — React + Node + MongoDB + Docker*

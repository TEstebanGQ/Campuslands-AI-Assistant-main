# 🤖 Campuslands AI Assistant

Asistente virtual inteligente de alto rendimiento desarrollado para Campuslands. El sistema utiliza modelos de lenguaje avanzados a través de OpenRouter para ofrecer respuestas precisas basadas en una base de conocimientos propietaria, gestionando sesiones independientes y control de inactividad.

---

## 🌟 Características Destacadas

### 1. Gestión de Sesiones Múltiples (Instancias)
El asistente permite al usuario mantener múltiples conversaciones simultáneas en una barra lateral dinámica. Cada chat posee su propio identificador único (`ID`) y su propio historial de mensajes, evitando que los contextos se mezclen.

### 2. Base de Conocimiento Inyectada
A diferencia de los bots genéricos, este asistente basa sus respuestas estrictamente en un archivo `data.json`. Esto garantiza que la IA no invente información sobre programas, costos o sedes de Campuslands.

### 3. Sistema de Seguridad de Tiempo (Timeout)
Implementa una lógica de limpieza y optimización de recursos:
- **Advertencia (2 min):** Notificación automática al usuario sobre inactividad.
- **Terminación (5 min):** Cierre forzado de la sesión y bloqueo de entrada de datos para prevenir el consumo innecesario de tokens y liberar memoria.

### 4. Interfaz y Experiencia de Usuario (UX)
- **Markdown Rendering:** Soporte para tablas, listas, negritas y enlaces gracias a `Marked.js`.
- **Race-Condition Prevention:** Las respuestas de la IA solo se renderizan si el usuario sigue en el chat correspondiente al momento de la llegada del paquete de datos.
- **Smart Input:** Envío rápido con `Enter` y saltos de línea con `Shift + Enter`.
- **Animaciones de Carga:** Indicadores visuales de proceso mientras la IA genera la respuesta.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | HTML5, Tailwind CSS (JIT via CDN) |
| Lógica | JavaScript Vanilla (ES6+) — arquitectura orientada a estados |
| AI Engine | Modelos vía OpenRouter API |
| Procesamiento de Texto | Marked.js para renderizado de Markdown |

---

## 📂 Estructura del Proyecto
```plaintext
├── index.html        # Estructura visual y estilos (Tailwind)
├── script.js         # Lógica central, gestión de timers y llamadas API
├── data.json         # Base de datos local de Campuslands
└── assets/
    └── logo.png      # Identidad visual del bot
```

---

## 🚀 Instalación y Configuración

**1. Clonación**
```bash
git clone https://github.com/CRISTIAN7712/Campuslands-AI-Assistant.git
cd Campuslands-AI-Assistant
```

**2. API Key**

Abre `script.js`, localiza la constante `OPENROUTER_API_KEY` y sustituye el valor por tu llave personal:
```javascript
const OPENROUTER_API_KEY = "tu_clave_aqui";
```

**3. Servidor Local**

El navegador bloquea peticiones `fetch` en archivos locales (`file://`), por lo que debes usar un servidor:

| Método | Comando |
|--------|---------|
| VS Code | Extensión **Live Server** |
| Python | `python -m http.server` |
| Node.js | `npx serve` |

---

## ⚙️ Configuración del Temporizador

Ajusta los tiempos de cierre en `script.js` dentro de la función `resetChatTimer`:

| Acción | Tiempo por defecto | Valor en ms |
|--------|--------------------|-------------|
| Advertencia | 2 minutos | `120000` |
| Cierre Final | 5 minutos | `300000` |

---

## 🛡️ Manejo de Errores

El sistema cuenta con protecciones para:

- **Fallos de API:** Mensajes de error amigables si la clave es inválida o no hay conexión.
- **Falta de Datos:** Si `data.json` no carga, el sistema inicia en modo limitado avisando al administrador.
- **Cruce de Mensajes:** Si cambias de chat antes de que llegue una respuesta, esta se guarda silenciosamente en el historial correcto sin interrumpir tu vista actual.

---

> *Campuslands AI — Transformando la educación tecnológica con inteligencia artificial.*

---

## Licencia

MIT License

Copyright (c) 2026 Ing. Cristian Díaz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

👤 Autor:
Desarrollado por Ing. Cristian Díaz

---
<p align="center">
  <img width="300" src="https://i.imgur.com/a7YBcsp.png">
</p>

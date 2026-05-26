import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initial default destinations matched with user style guide
const DEFAULT_DESTINATIONS = [
  {
    id: 'arg',
    title: 'Argentina',
    country: 'Argentina',
    code: 'AR',
    status: 'Activo',
    description: 'Visite las majestuosas cataratas del lado argentino con su famosa pasarela a la Garganta del Diablo. Disfrute de la exquisita gastronomía local, espectáculos de tango y hotelería inmersa en la selva subtropical misionera.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7wy_6scgevLaxwTBCCwhbIgpZAgsrlVn5EjCNC5OIpsY1vRRstHwaiued_KHl6QK3Ev07FtrhQ2kSJKKtMlc3T1MRjhuGth8aKiKk5B4e9kLw-24J9IoZUYzb-0IkFUJVrpNmYCnUFvryNYfjlwL9FGvbzqiYaixYGIp94v62w4c-2A0kAMNVK02LTJKrg6lhEO7rQ5I4Z9E2m8gttEzBzGEhT1dLPOptR8wHoxZS3kdnHyxGp0WHwA9uDQ123g-pBdbsyVDMjtTI',
    price4Pax: 50000,
    price6Pax: 70000,
    price4PaxUsd: 45,
    price6PaxUsd: 65
  },
  {
    id: 'bra',
    title: 'Brasil',
    country: 'Brasil',
    code: 'BR',
    status: 'Activo',
    description: 'Explore las cataratas del lado brasilero que ofrece la vista panorámica más espectacular e imponente de los saltos. Complete su experiencia visitando el fascinante Parque de las Aves y disfrutando de un tradicional rodizio de carnes.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqhXKn-9SQezi472rx7V_H8TKFOybFSBYI91bZogHEu4U7F9oYcv9uUBIZUtaly6kV4WnPp1U0kbc_TslnReyYXUn_43DUgQ8e9b52O2vTsqC1gwv6v-CGSSidfmWMn23Z89EPIx4Voes6GvFzksGLcAi4IXvIy2ioWdRGhT1PSzcH-XrUOojYacUnkCt9n2AnA6nEBzNZbwxIe91FAo69d8j6UF187sP7soGPd9ao1AsFYvMcXxSt1UeJvOHmNbUpdxT3wzyobopq',
    price4Pax: 50000,
    price6Pax: 70000,
    price4PaxUsd: 45,
    price6PaxUsd: 65
  },
  {
    id: 'par',
    title: 'Paraguay',
    country: 'Paraguay',
    code: 'PY',
    status: 'Activo',
    description: 'Visite el centro de compras libre de impuestos más grande de Sudamérica en Ciudad del Este. Descubra la imponente ingeniería de la Represa de Itaipú, su rica artesanía en filigrana, y la calidez de su cultura bilingüe español-guaraní.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvEcKISmAd3mxlglQB-jg2HwXm_t_VY1utGm27tESL3-PVFPN68lSqjLj9LCJ2jz_RiVuTF_TaOFoVjJ0tTaDwwrg_KZbznn6dDk5iL_whetkQdVuzcDsMkGlRkpAPK5nshBFta8mnFwstMvAzVy7oyNvEMQrR0Ojcx3-FWVsYabMEvI8z5ohcsjaCw-zdfGMTeY_sy-Im3fpwukpeJlrIASJTr4ZAx_baU7u7rn0LtE1Q3o-4sP2N1W1E27p4MgrNaft_7TNRh4Rc',
    price4Pax: 50000,
    price6Pax: 70000,
    price4PaxUsd: 45,
    price6PaxUsd: 65
  }
];

const DB_PATH = path.join(__dirname, 'destinations.json');
const USERS_PATH = path.join(__dirname, 'users.json');

const DEFAULT_USERS = [
  {
    id: 'u-1',
    username: 'admin',
    password: 'admin',
    role: 'admin',
    fullName: 'Administrador Principal'
  },
  {
    id: 'u-2',
    username: 'operador',
    password: '123',
    role: 'usuario',
    fullName: 'Operador de Destinos'
  }
];

// Helper to read database
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DESTINATIONS, null, 2), 'utf-8');
      return DEFAULT_DESTINATIONS;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading destinations.json, returning default list:', error);
    return DEFAULT_DESTINATIONS;
  }
}

// Helper to write database
function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to destinations.json:', error);
  }
}

// Helper to read users database
function readUsersDB() {
  try {
    if (!fs.existsSync(USERS_PATH)) {
      fs.writeFileSync(USERS_PATH, JSON.stringify(DEFAULT_USERS, null, 2), 'utf-8');
      return DEFAULT_USERS;
    }
    const raw = fs.readFileSync(USERS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading users.json, returning default list:', error);
    return DEFAULT_USERS;
  }
}

// Helper to write users database
function writeUsersDB(data: any) {
  try {
    fs.writeFileSync(USERS_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to users.json:', error);
  }
}


async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON request parser
  app.use(express.json());

  // API REST endpoints for Destinations
  // 1. Get all destinations
  app.get('/api/destinations', (req, res) => {
    const list = readDB();
    res.json(list);
  });

  // 2. Create a new destination
  app.post('/api/destinations', (req, res) => {
    try {
      const { title, country, code, status, description, imageUrl, price4Pax, price6Pax, price4PaxUsd, price6PaxUsd } = req.body;

      if (!title || !country || !code || !description) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      const list = readDB();
      const newDest = {
        id: 'dest-' + Math.floor(Math.random() * 1000000),
        title,
        country,
        code: code.toUpperCase(),
        status: status || 'Activo',
        description,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
        price4Pax: Number(price4Pax) || 50000,
        price6Pax: Number(price6Pax) || 70000,
        price4PaxUsd: Number(price4PaxUsd) || 45,
        price6PaxUsd: Number(price6PaxUsd) || 65
      };

      list.push(newDest);
      writeDB(list);

      res.status(210).json(newDest);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Update an existing destination
  app.put('/api/destinations/:id', (req, res) => {
    try {
      const { id } = req.params;
      const { title, country, code, status, description, imageUrl, price4Pax, price6Pax, price4PaxUsd, price6PaxUsd } = req.body;

      const list = readDB();
      const index = list.findIndex((item: any) => item.id === id);

      if (index === -1) {
        return res.status(404).json({ error: 'Destino no encontrado' });
      }

      list[index] = {
        ...list[index],
        title: title || list[index].title,
        country: country || list[index].country,
        code: (code || list[index].code).toUpperCase(),
        status: status || list[index].status,
        description: description || list[index].description,
        imageUrl: imageUrl || list[index].imageUrl,
        price4Pax: price4Pax !== undefined ? Number(price4Pax) : list[index].price4Pax,
        price6Pax: price6Pax !== undefined ? Number(price6Pax) : list[index].price6Pax,
        price4PaxUsd: price4PaxUsd !== undefined ? Number(price4PaxUsd) : list[index].price4PaxUsd,
        price6PaxUsd: price6PaxUsd !== undefined ? Number(price6PaxUsd) : list[index].price6PaxUsd
      };

      writeDB(list);
      res.json(list[index]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 4. Delete a destination
  app.delete('/api/destinations/:id', (req, res) => {
    try {
      const { id } = req.params;
      const list = readDB();
      const filtered = list.filter((item: any) => item.id !== id);

      if (filtered.length === list.length) {
        return res.status(404).json({ error: 'Destino no encontrado' });
      }

      writeDB(filtered);
      res.json({ success: true, message: 'Destino eliminado correctamente' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. Restablecer valores default
  app.post('/api/destinations/reset', (req, res) => {
    writeDB(DEFAULT_DESTINATIONS);
    res.json({ success: true, message: 'Base de datos restablecida a valores por defecto' });
  });

  // 6. Auth Login Endpoint
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y clave requeridos' });
    }
    const users = readUsersDB();
    const match = users.find((u: any) => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    res.json({
      id: match.id,
      username: match.username,
      fullName: match.fullName,
      role: match.role
    });
  });

  // 7. Get all users listing (only administrative context, passwords included for blank/reset ease)
  app.get('/api/users', (req, res) => {
    try {
      const list = readUsersDB();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 8. Create a new user
  app.post('/api/users', (req, res) => {
    try {
      const { username, password, role, fullName } = req.body;
      if (!username || !password || !role || !fullName) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      const list = readUsersDB();
      if (list.some((u: any) => u.username.toLowerCase() === username.trim().toLowerCase())) {
        return res.status(400).json({ error: 'El nombre de usuario ya existe' });
      }

      const newUser = {
        id: 'user-' + Math.floor(Math.random() * 1000000),
        username: username.trim().toLowerCase(),
        password,
        role: role === 'admin' ? 'admin' : 'usuario',
        fullName: fullName.trim()
      };

      list.push(newUser);
      writeUsersDB(list);

      res.status(201).json(newUser);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 9. Update an existing user (supports blanqueo de contraseña, change role or details)
  app.put('/api/users/:id', (req, res) => {
    try {
      const { id } = req.params;
      const { username, password, role, fullName } = req.body;

      const list = readUsersDB();
      const index = list.findIndex((u: any) => u.id === id);

      if (index === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      if (username) {
        const lowerUsername = username.trim().toLowerCase();
        if (lowerUsername !== list[index].username && list.some((u: any) => u.username === lowerUsername)) {
          return res.status(400).json({ error: 'El nombre de usuario ya está ocupado' });
        }
        list[index].username = lowerUsername;
      }

      if (password !== undefined) {
        list[index].password = password;
      }

      if (role) {
        list[index].role = role === 'admin' ? 'admin' : 'usuario';
      }

      if (fullName) {
        list[index].fullName = fullName.trim();
      }

      writeUsersDB(list);
      res.json(list[index]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 10. Delete a user (preventing self & factory account deletion)
  app.delete('/api/users/:id', (req, res) => {
    try {
      const { id } = req.params;
      if (id === 'u-1' || id === 'u-admin') {
        return res.status(400).json({ error: 'No es posible dar de baja al Administrador Principal de fábrica' });
      }

      const list = readUsersDB();
      const filtered = list.filter((u: any) => u.id !== id);

      if (filtered.length === list.length) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      writeUsersDB(filtered);
      res.json({ success: true, message: 'Usuario dado de baja con éxito' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 11. Reset users list to default
  app.post('/api/users/reset', (req, res) => {
    writeUsersDB(DEFAULT_USERS);
    res.json({ success: true, message: 'Usuarios restablecidos' });
  });

  // Vite middleware setup for Development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production serving static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SYS-SERVER] transfersaeropuerto backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

<<<<<<< HEAD
=======
// Explicitly allow CORS from any origin for development
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

>>>>>>> feature/checkout_card
const SECRET_KEY = 'super-secret-key';
const expiresIn = '1h';

function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) => (decode !== undefined ? decode : err));
}

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/register', (req, res) => {
  const { email, password } = req.body;
  const userExists = router.db.get('users').find({ email }).value();
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const newUser = router.db.get('users').insert(req.body).write();
  const accessToken = createToken({ id: newUser.id, email: newUser.email });
  res.status(201).json({ accessToken });
});

server.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = router.db.get('users').find({ email, password }).value();
  if (!user) return res.status(401).json({ message: 'Incorrect email or password' });

  const accessToken = createToken({ id: user.id, email: user.email });
  res.status(200).json({ accessToken });
});

server.use((req, res, next) => {
  if (req.method === 'GET' || req.path === '/login' || req.path === '/register') {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader.split(' ')[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Unauthorized: No Token Provided' });
  }

  const token = authHeader.split(' ')[1];
  const verifyTokenResult = verifyToken(token);

  if (verifyTokenResult instanceof Error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }

  next();
});

server.use(router);
server.listen(3000, () => {
  console.log('--- JSON Server with JWT Auth is Running! ---');
  console.log('Base URL: http://localhost:3000');
  console.log('--------------------------------------------');

  const db = router.db.getState();
  Object.keys(db).forEach((key) => {
    console.log(`Endpoint: http://localhost:3000/${key} `);
  });

  console.log('--------------------------------------------');
  console.log('Auth Routes:');
  console.log('  POST http://localhost:3000/login');
  console.log('  POST http://localhost:3000/register');
});

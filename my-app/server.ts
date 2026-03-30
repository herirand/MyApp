import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';

const app = Fastify();
const prisma = new PrismaClient();

// 1. Configuration du JWT (le secret sert à crypter le badge)
app.register(fastifyJwt, {
  secret: 'MON_SECRET_TRES_SECURISE' // En production, mets ça dans un fichier .env
});

// ---------------------------------------------------------
// ROUTE 1 : LOGIN (Création du badge/token)
// ---------------------------------------------------------
app.post('/login', async (request, reply) => {
  const { email, password } = request.body as any;

  // On cherche l'utilisateur
  const user = await prisma.user.findUnique({ where: { email } });

  // (Ici, tu dois normalement vérifier si le mot de passe est correct avec bcrypt/argon2)
  if (!user || user.password !== password) {
    return reply.status(401).send({ message: "Email ou mot de passe incorrect" });
  }

  // C'est ici qu'on "fabrique le badge". On y cache l'ID et le RÔLE !
  const token = app.jwt.sign({ 
    id: user.id, 
    role: user.role 
  });

  return { token: token }; // Copie ce token dans Swagger !
});


// ---------------------------------------------------------
// ROUTE 2 : ADMIN UNIQUEMENT (Ajouter une transaction)
// ---------------------------------------------------------
app.post('/transactions', async (request, reply) => {
  try {
    // 1. On lit le badge (si le token est invalide ou absent, ça plante et s'arrête)
    const decodedToken = await request.jwtVerify<{ id: number, role: string }>();

    // 2. Le Vigile vérifie le rôle !
    if (decodedToken.role !== 'ADMIN') {
      return reply.status(403).send({ message: "Interdit. Vous n'êtes pas Admin." });
    }

    // 3. Si c'est l'Admin, on ajoute la transaction pour un étudiant
    const { amount, description, studentId } = request.body as any;
    
    const newTransaction = await prisma.transaction.create({
      data: { amount, description, studentId }
    });

    return reply.send(newTransaction);

  } catch (err) {
    return reply.status(401).send({ message: "Token invalide ou manquant." });
  }
});


// ---------------------------------------------------------
// ROUTE 3 : ÉTUDIANT (Voir ses propres transactions)
// ---------------------------------------------------------
app.get('/transactions/me', async (request, reply) => {
  try {
    // 1. On lit le badge
    const decodedToken = await request.jwtVerify<{ id: number, role: string }>();

    // 2. On utilise SON ID (et pas un ID envoyé dans l'URL) pour chercher en base
    const myTransactions = await prisma.transaction.findMany({
      where: { 
        studentId: decodedToken.id // On filtre strictement pour cet utilisateur
      }
    });

    return reply.send(myTransactions);

  } catch (err) {
    return reply.status(401).send({ message: "Token invalide ou manquant." });
  }
});

// Lancement du serveur
app.listen({ port: 3000 }, () => console.log('Serveur démarré !'));
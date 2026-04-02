import { prisma } from "@myapp/db";
import { FastifyRequest, FastifyReply } from "fastify";

type TokenPayload = {
	id: number;
	role: string;
};

async function transactionAdminService(request: FastifyRequest, reply: FastifyReply) {
	try {
		const decodedToken = await request.jwtVerify<TokenPayload>();

		if (decodedToken.role !== 'ADMIN') {
			return reply.status(403).send({ error: "admin only" });
		}

		const { amount, description, username } = request.body as any;

		const existingUser = await prisma.user.findFirst({
			where: {
				username
			}
		})

		if (!existingUser) {
			return reply.status(401).send({
				success: false,
				error: "Veuillez verifier le ID de l'utilisateur"
			})
		}

		const newTransaction = await prisma.transaction.create({
			data: { amount, description, studentId: existingUser.id, username }
		});

		return reply.send(newTransaction);
	} catch (error) {
		return reply.code(401).send({
			success: false,
			error: error ?? "token invalide",
		});
	}
}

export default transactionAdminService;

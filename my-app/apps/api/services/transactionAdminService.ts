import { prisma } from "@myapp/db";
import { FastifyRequest, FastifyReply } from "fastify";

type TokenPayload = {
	id: number;
	role: string;
};

async function transactionAdminService(request: FastifyRequest, reply: FastifyReply) {
	try {
		console.log(`token recu Admin : ${request.headers}`);
		const decodedToken = await request.jwtVerify<TokenPayload>();

		if (decodedToken.role !== 'ADMIN') {
			return reply.status(403).send({ error: "admin only" });
		}

		const { amount, description, studentId } = request.body as any;

		const newTransaction = await prisma.transaction.create({
			data: { amount, description, studentId }
		});

		return reply.send(newTransaction);
	} catch (error) {
		return reply.code(401).send({
			success: false,
			error: "token invalide",
		});
	}
}

export default transactionAdminService;

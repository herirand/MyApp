import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@myapp/db";
import "@fastify/jwt";

type TokenPayload = {
	id: number;
	role: string;
};

async function transactionStudentService(request: FastifyRequest, reply: FastifyReply) {
	try {
		const decodedToken = await request.jwtVerify<TokenPayload>();

		const mytransactions = await prisma.transaction.findMany({
			where: {
				studentId: decodedToken.id
			}
		});

		return reply.send(mytransactions);

	} catch (error) {
		return reply.code(401).send({
			success: false,
			error: "token invalide",
		});
	}
}

export default transactionStudentService;

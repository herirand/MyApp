import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@myapp/db";
import "@fastify/jwt";

async function transactionStudentService(request: FastifyRequest, reply: FastifyReply) {
	try {
		let studeId: number = Number(request.user.id);

		const mytransactions = await prisma.transaction.findMany({
			where: {
				studentId: studeId
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

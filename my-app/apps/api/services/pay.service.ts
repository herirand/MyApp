import { prisma } from "@myapp/db";
import { FastifyReply, FastifyRequest } from "fastify";

async function payService(request: FastifyRequest, reply: FastifyReply) {
	try {

		const TOTAL_ID = 1;
		const total = await prisma.global.findUnique({
			where: { id: TOTAL_ID }
		});

		return reply.code(200).send(total ? [total] : []);

	} catch (error) {
		return reply.status(500).send({
			success: false,
			error: 'token invalide',
		})
	}
}

export default payService;

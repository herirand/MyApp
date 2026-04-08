import { prisma } from "@myapp/db";
import { FastifyRequest, FastifyReply } from "fastify";

async function beneficeMeService(request: FastifyRequest, reply: FastifyReply) {
	try {

		const benefice = await prisma.benefice.findMany({
			orderBy: {
				createdAt: 'desc',
			}
		});
		return reply.status(200).send(benefice);
	} catch (error) {
		return reply.status(401).send({
			success: false,
			error: error ?? 'token invalide',
		});
	}
}

export default beneficeMeService;

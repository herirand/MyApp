import { prisma } from "@myapp/db";
import { FastifyReply, FastifyRequest } from "fastify";

type TokenPayload = {
	id: number;
	role: string;
}

async function payService(request: FastifyRequest, reply: FastifyReply) {
	try {
		await request.jwtVerify<TokenPayload>();

		const total = await prisma.global.findMany();

		return reply.code(200).send(total);

	} catch (error) {
		return reply.status(500).send({
			success: false,
			error: 'token invalide',
		})
	}
}

export default payService;

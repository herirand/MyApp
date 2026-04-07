import { prisma } from "@myapp/db";
import { FastifyRequest, FastifyReply } from "fastify";

type TokenPayload = {
	id: number;
	role: string;
}

async function expenseMeService(request: FastifyRequest, reply: FastifyReply) {
	try {
		await request.jwtVerify<TokenPayload>();

		const all = await prisma.expense.findMany();

		return reply.code(200).send(all);

	} catch (error) {
		return reply.status(401).send({
			success: false,
			error: 'token invalide',
		})
	}
}

export default expenseMeService;

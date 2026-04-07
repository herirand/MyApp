import { prisma } from "@myapp/db";
import { FastifyRequest, FastifyReply } from "fastify";

type TokenPayload = {
	id: number;
	role: string;
}

async function expenseMeService(request: FastifyRequest, reply: FastifyReply) {
	try {
		await request.jwtVerify<TokenPayload>();

		const expenses = await prisma.expense.findMany({
			orderBy: {
				createdAt: 'desc',
			},
		});

		return reply.code(200).send(expenses);

	} catch (error) {
		return reply.status(401).send({
			success: false,
			error: 'token invalide',
		})
	}
}

export default expenseMeService;

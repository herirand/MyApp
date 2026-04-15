import { prisma } from "@myapp/db";
import { FastifyRequest, FastifyReply } from "fastify";
import { AppError } from "../lib/errors";

async function expenseMeService(request: FastifyRequest, reply: FastifyReply) {
	try {

		const page = Math.max(1, parseInt((request.query as any)?.page) || 1);
		const limit = Math.min(100, Math.max(1, parseInt((request.query as any)?.limit) || 20));

		const expenses = await prisma.expense.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			skip: (page - 1) * limit,
			take: limit,
		});

		return reply.code(200).send(expenses);

	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Internal server error';
		return reply.status(500).send({
			success: false,
			error: errorMessage,
		})
	}
}

export default expenseMeService;

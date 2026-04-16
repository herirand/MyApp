import { prisma } from "@myapp/db";
import { FastifyRequest, FastifyReply } from "fastify";

async function beneficeMeService(request: FastifyRequest, reply: FastifyReply) {
	try {

		const page = Math.max(1, parseInt((request.query as any)?.page) || 1);
		const limit = Math.min(100, Math.max(1, parseInt((request.query as any)?.limit) || 20));

		const total = await prisma.benefice.count();

		const benefice = await prisma.benefice.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			skip: (page - 1) * limit,
			take: limit,
		});

		return reply.status(200).send({
			data: benefice,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			}
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Internal server error';
		return reply.status(500).send({
			success: false,
			error: errorMessage,
		});
	}
}

export default beneficeMeService;

import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@myapp/db";
import "@fastify/jwt";

async function transactionStudentService(request: FastifyRequest, reply: FastifyReply) {
	try {
		let studeId: number = Number(request.user.id);
		const page = Math.max(1, parseInt((request.query as any)?.page) || 1);
		const limit = Math.min(100, Math.max(1, parseInt((request.query as any)?.limit) || 20));

		const total = await prisma.transaction.count({
			where: { studentId: studeId },
		});

		const mytransactions = await prisma.transaction.findMany({
			where: {
				studentId: studeId
			},
			skip: (page - 1) * limit,
			take: limit,
		});

		return reply.send({
			data: mytransactions,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			}
		});

	} catch (error) {
		return reply.code(401).send({
			success: false,
			error: "token invalide",
		});
	}
}

export default transactionStudentService;

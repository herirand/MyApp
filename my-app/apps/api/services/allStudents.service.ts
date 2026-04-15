import { prisma } from "@myapp/db";
import { FastifyReply, FastifyRequest } from "fastify";

async function allStudentsService(request: FastifyRequest, reply: FastifyReply) {
	try {

		const page = Math.max(1, parseInt((request.query as any)?.page) || 1);
		const limit = Math.min(100, Math.max(1, parseInt((request.query as any)?.limit) || 20));

		const all = await prisma.user.findMany({
			where: {
				role: 'STUDENT',
			},
			orderBy: {
				username: 'asc',
			},
			select: {
				id: true,
				username: true,
				userId: true,
			},
			skip: (page - 1) * limit,
			take: limit,
		});

		return reply.send(all);

	} catch (error) {
		return reply.status(401).send({
			success: false,
			error: error ?? 'erreur lors de la recuperation des etudiants',
		})
	}
}

export default allStudentsService;

import { prisma } from "@myapp/db";
import { FastifyReply, FastifyRequest } from "fastify";

async function allStudentsService(request: FastifyRequest, reply: FastifyReply) {
	try {

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
			}
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

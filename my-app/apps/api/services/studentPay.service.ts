import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@myapp/db";
import { AppError } from "../lib/errors";

async function studentPayService(request: FastifyRequest, reply: FastifyReply) {
	try {
		const student_Id: number = Number(request.user.id);

		const user = await prisma.user.findFirst({
			where: { id: student_Id },
		})

		if (!user) {
			throw new AppError('user not found', 404);
		}
		return reply.send({
			balance: user.balance,
		})

	} catch (error) {
		if (error instanceof AppError) {
			return reply.status(error.status).send({ error: error.message });
		}
		return reply.status(500).send({ error: 'internal server error' });
	}

}

export default studentPayService;

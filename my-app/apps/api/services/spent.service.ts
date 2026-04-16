import { prisma } from "@myapp/db";
import { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../lib/errors";

async function spentService(request: FastifyRequest, reply: FastifyReply) {
	try {

		const SPENT_ID = 2;
		const spent = await prisma.global.findMany({
			where: { id: SPENT_ID },
		});

		if (!spent) {
			throw new AppError("spent not found", 404);
		}

		return reply.status(200).send({
			success: true,
			spent,
		})

	} catch (error) {
		if (error instanceof AppError) {
			return reply.status(error.status).send({ success: false, error: error.message });
		}
		return reply.status(500).send({ success: false, error: 'internal server error' });
	}
}

export default spentService;

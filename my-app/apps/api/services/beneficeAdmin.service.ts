import { prisma } from "@myapp/db";
import { FastifyRequest, FastifyReply } from "fastify";

async function beneficeService(request: FastifyRequest, reply: FastifyReply) {
	try {

		const { amount, description } = request.body as {
			amount: number;
			description: string;
		}

		if (amount < 0) {
			return reply.code(400).send({
				success: false,
				error: 'valeur negative',
			});
		}

		const GLOBAL_ID = 1;

		await prisma.global.upsert({
			where: { id: GLOBAL_ID },
			update: { total: { increment: amount } },
			create: { id: GLOBAL_ID, total: amount }
		});

		const newBenefice = await prisma.benefice.create({
			data: { amount, description }
		});

		return reply.send(newBenefice);
	} catch (error) {
		return reply.code(401).send({
			success: false,
			error: error ?? 'erreur lors du mise a jour du benefice',
		});
	}
}

export default beneficeService;

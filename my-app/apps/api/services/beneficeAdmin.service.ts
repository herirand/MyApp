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

		const globalTotal = await prisma.global.findFirst();
		const currentTotal = globalTotal?.total ?? 0;
		const newTotal = currentTotal + amount;

		await prisma.global.upsert({
			where: { id: globalTotal?.id },
			update: { total: { increment: newTotal } },
			create: { total: newTotal }
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

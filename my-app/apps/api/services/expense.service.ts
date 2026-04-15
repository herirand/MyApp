import { prisma } from "@myapp/db";
import { FastifyReply, FastifyRequest } from "fastify";

async function expenseService(request: FastifyRequest, reply: FastifyReply) {
	try {

		const { amount, description } = request.body as {
			amount: number,
			description: string,
		}

		if (amount < 0) {
			return reply.status(400).send({
				success: false,
				error: 'valeur negative'
			});
		}

		const globalTotal = await prisma.global.findFirst();
		const currentTotal = globalTotal?.total ?? 0;
		const newTotal = currentTotal - amount;
		console.log(`currentTotal: ${currentTotal} | amount: ${amount} | newTotal: ${newTotal}`);

		await prisma.global.upsert({
			where: { id: globalTotal?.id },
			update: { total: newTotal },
			create: { total: newTotal }
		})

		const newExpense = await prisma.expense.create({
			data: { amount, description }
		})

		return reply.send(newExpense);
	} catch (error) {
		return reply.status(401).send({
			success: false,
			error: error ?? "erreur lors du retrait",
		})
	}
}

export default expenseService;

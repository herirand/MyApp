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
		const AMOUNT_ID = 1;
		const EXPENSE_ID = 2;

		await prisma.global.upsert({
			where: { id: AMOUNT_ID },
			update: { total: { decrement: amount } },
			create: { id: AMOUNT_ID, total: amount }
		})

		const newExpense = await prisma.expense.create({
			data: { amount, description }
		})

		await prisma.global.upsert({
			where: { id: EXPENSE_ID },
			create: { id: EXPENSE_ID, total: amount },
			update: { total: { increment: amount } }
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

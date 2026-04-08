import { FastifyInstance } from "fastify";
import { expenseDto } from "../dto/expense.dto";
import expenseService from "../services/expense.service";
import transactionAdminService from "../services/transactionAdmin.service";
import beneficeService from "../services/beneficeAdmin.service";
import { requireAdmin } from "../middlwares/admin.middleware";
import { transactionAdminDto } from "../dto/transaction.dto";
import { beneficeDto } from "../dto/benefice.dto";


async function adminRoutes(app: FastifyInstance) {
	app.post('/expense', { ...expenseDto, preHandler: requireAdmin }, expenseService);
	app.post('/transactions', { ...transactionAdminDto, preHandler: requireAdmin }, transactionAdminService);
	app.post('/benefice', { ...beneficeDto, preHandler: requireAdmin }, beneficeService);
}

export default adminRoutes;

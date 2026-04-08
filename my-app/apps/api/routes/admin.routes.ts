import { FastifyInstance } from "fastify";
import { expenseDto } from "../dto/expense.dto";
import expenseService from "../services/expense.service";
import transactionAdminService from "../services/transactionAdmin.service";
import { requireAdmin } from "../middlwares/admin.middleware";
import { transactionAdminDto } from "../dto/transaction.dto";


async function adminRoutes(app: FastifyInstance) {
	app.post('/expense', { ...expenseDto, preHandler: requireAdmin }, expenseService);
	app.post('/transactions', { ...transactionAdminDto, preHandler: requireAdmin }, transactionAdminService);
}

export default adminRoutes;

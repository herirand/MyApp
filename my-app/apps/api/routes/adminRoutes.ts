import { FastifyInstance } from "fastify";
import { expenseDto, expenseMeDto, payDto } from "../dto/expenseDto";
import expenseService from "../services/expenseService";
import expenseMeService from "../services/expenseMeService";
import payService from "../services/payService";
import { requireAdmin } from "../middlwares/admin.middleware";
import { authenticate } from "../middlwares/auth.middleware";


async function adminRoutes(app: FastifyInstance) {
	app.post('/expense', { ...expenseDto, preHandler: requireAdmin }, expenseService);
	app.get('/expense/me', { ...expenseMeDto, preHandler: authenticate }, expenseMeService);
	app.get('/pay', { ...payDto, preHandler: authenticate }, payService);
}

export default adminRoutes;

import { FastifyInstance } from "fastify";
import transactionStudentService from "../services/transactionStudent.service";
import { transactionStudentDto } from "../dto/transaction.dto";
import { expenseMeDto, payDto } from "../dto/expense.dto";
import { authenticate } from "../middlwares/auth.middleware";
import expenseMeService from "../services/expenseMe.service";
import payService from "../services/pay.service";
import beneficeMeDto from "../services/beneficeMe.service";
import { beneficeMeDto } from "../dto/benefice.dto";


async function transactionRoutes(app: FastifyInstance) {
	app.get('/transactions/me', { ...transactionStudentDto, preHandler: authenticate }, transactionStudentService);
	app.get('/expense/me', { ...expenseMeDto, preHandler: authenticate }, expenseMeService);
	app.get('/pay', { ...payDto, preHandler: authenticate }, payService);
	app.get('/benefice/me', { ...beneficeMeDto, preHandler: authenticate }, beneficeMeService);
}

export default transactionRoutes;

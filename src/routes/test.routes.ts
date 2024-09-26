import { Router } from 'express';
import testController from '../controllers/test.controller';

const testRouter: Router = Router();

testRouter.get('/all', testController.getTests);
testRouter.get('/getCookie', testController.getCookie);
testRouter.get('/:id', testController.getTestByIdAndSetCookie);
testRouter.post('/', testController.createDefaultTest);

export default testRouter;
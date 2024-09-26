import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils';
import testActuator from '../actuators/test.actuator';

class TestController {
  async getTests(_: Request, res: Response) {
    try {
      const tests = await testActuator.getTests();

      return successResponse({ data: tests, res });
    } catch (error) {
      return errorResponse({ error, res });
    }
  }

  async getTestByIdAndSetCookie(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const test = await testActuator.getTestById({ id });

      res.cookie('testId', test?._id.toString());

      return successResponse({ data: test, res });
    } catch (error) {
      return errorResponse({ error, res });
    }
  }

  async getCookie (req:Request, res: Response) {
    try {
      const cookieTestId = req.cookies.testId;
    
      return successResponse({ data: cookieTestId, res });
    } catch (error) {
      return errorResponse({ error, res, status: 500 });
    }
  }

  async createDefaultTest(req: Request, res: Response) {
    try {
      const { description } = req.body;

      const tests = await testActuator.createDefaultTest({ description });

      return successResponse({ data: tests, res });
    } catch (error) {
      return errorResponse({ error, res });
    }
  }
}

export default new TestController();
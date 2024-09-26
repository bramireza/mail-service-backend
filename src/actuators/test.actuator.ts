import TestModel from '../models/test.model';

const TITLE_DEFAULT = 'TEST ONE';

interface CreateDefaultTestArgs {
  description?: string;
}

interface GetTestByIdArgs {
  id?: string;
}

class TestActuator {
  async getTests() {
    return await TestModel.find({}).lean();
  }
  
  async getTestById({ id }: GetTestByIdArgs) {
    return await TestModel.findById(id).lean();
  }

  async createDefaultTest({ description }: CreateDefaultTestArgs) {
    const test = await TestModel.findOne({ title: TITLE_DEFAULT }).lean();

    if(test) return test;

    return await TestModel.create({
      description,
      title: TITLE_DEFAULT
    });
  }
}

export default new TestActuator();
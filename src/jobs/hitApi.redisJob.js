import Queue from 'bull';
import models from '../mongoose';
import opts from '../lib/redisConnection';

export const hitApiQueue = new Queue('last-login', opts);

hitApiQueue.process(async (job) => {
  try {
    console.log('Resolve job:', job.id, job.data.apiUrl)
    const { apiUrl } = job.data;

    const result = await models.HitApi.findOneAndUpdate({ api: apiUrl }, {
      $inc: { count: 1 }
    });
    return Promise.resolve({ result });
  } catch (error) {
    console.log('Reject with:', error)
    Promise.reject(error);
  }
});

const hitApi = async (req, res, next) => {
  hitApiQueue.add({ apiUrl: req.originalUrl });
  next();
};


export default hitApi;

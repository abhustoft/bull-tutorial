import express from 'express';
import { connectToMongo } from './mongoose';
import hitApi from './jobs/hitApi.redisJob';
import { hitApiQueue } from './jobs/hitApi.redisJob';
import { BullAdapter, router as BullBoardRouter, setQueues } from "bull-board";

setQueues([
  new BullAdapter(hitApiQueue),
]);


const app = express();

connectToMongo();
// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world, you');
});

app.use("/dashboard", BullBoardRouter);

app.use(hitApi);

app.get('/api-1', (req, res) => {

  hitApiQueue.count().then(function(res) {
    console.log('count 1:', res);
  });

  hitApiQueue.getCompleted().then(function(jobs) {
    jobs.forEach(job => {
      console.log('Completed job:', job.id, job.finishedOn);
    });
    
  });

  res.send('you hit api-1');
});

app.get('/api-2', (req, res) => {
  hitApiQueue.count().then(function(res) {
    console.log('count 2:', res);
  });
  res.send('you hit api-2');
});

app.get('/api-clean', (req, res) => {
  hitApiQueue.clean(1000).then(function(res) {
    console.log('Emptied:', res);
  });
  res.send('you hit api-clean');
});

app.listen(3000, () => console.log('server listening on port 3000!'));


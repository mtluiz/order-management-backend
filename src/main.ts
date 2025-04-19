import { ServerApplication } from '@/application/ServerApplication';

async function runApplication() {
  const serverApplication = new ServerApplication();
  await serverApplication.run();
}

runApplication();

import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function clearSeedData() {
  await AppDataSource.initialize();

  // Xóa theo thứ tự — tránh FK constraint
  await AppDataSource.query(`DELETE FROM resume_skill`);
  await AppDataSource.query(`DELETE FROM job_skill`);
  await AppDataSource.query(`DELETE FROM application`);
  await AppDataSource.query(`DELETE FROM resume`);
  await AppDataSource.query(`DELETE FROM "jobPost" WHERE "employerId" IN (
    SELECT id FROM "user" WHERE email LIKE '%@test.com'
  )`);
  await AppDataSource.query(`DELETE FROM employer`);
  await AppDataSource.query(`DELETE FROM candidate`);
  await AppDataSource.query(`DELETE FROM company WHERE "ownerId" IN (
    SELECT id FROM "user" WHERE email LIKE '%@test.com'
  )`);
  await AppDataSource.query(`DELETE FROM "user" WHERE email LIKE '%@test.com'`);

  console.log('✅ Seed data cleared!');
  await AppDataSource.destroy();
}

clearSeedData().catch(console.error);

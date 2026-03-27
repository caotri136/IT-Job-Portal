// src/skill/skill.service.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './skill.entity';
import { SkillCategory } from './skillCategory.enum';

@Injectable()
export class SkillService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedSkills();
  }

  private async seedSkills() {
    const count = await this.skillRepository.count();
    if (count > 0) return;

    const skills: { name: string; category: SkillCategory }[] = [
      // Language
      { name: 'Java', category: SkillCategory.LANGUAGE },
      { name: 'Python', category: SkillCategory.LANGUAGE },
      { name: 'JavaScript', category: SkillCategory.LANGUAGE },
      { name: 'TypeScript', category: SkillCategory.LANGUAGE },
      { name: 'C', category: SkillCategory.LANGUAGE },
      { name: 'C++', category: SkillCategory.LANGUAGE },
      { name: 'C#', category: SkillCategory.LANGUAGE },
      { name: 'Go', category: SkillCategory.LANGUAGE },
      { name: 'Kotlin', category: SkillCategory.LANGUAGE },
      { name: 'Swift', category: SkillCategory.LANGUAGE },
      { name: 'PHP', category: SkillCategory.LANGUAGE },
      { name: 'Rust', category: SkillCategory.LANGUAGE },
      { name: 'Scala', category: SkillCategory.LANGUAGE },
      { name: 'Ruby', category: SkillCategory.LANGUAGE },
      { name: 'R', category: SkillCategory.LANGUAGE },
      { name: 'MATLAB', category: SkillCategory.LANGUAGE },
      { name: 'Assembly', category: SkillCategory.LANGUAGE },
      { name: 'Dart', category: SkillCategory.LANGUAGE },
      { name: 'Lua', category: SkillCategory.LANGUAGE },
      { name: 'Shell Script', category: SkillCategory.LANGUAGE },

      // Framework
      { name: 'NestJS', category: SkillCategory.FRAMEWORK },
      { name: 'Spring Boot', category: SkillCategory.FRAMEWORK },
      { name: 'React', category: SkillCategory.FRAMEWORK },
      { name: 'Vue', category: SkillCategory.FRAMEWORK },
      { name: 'Angular', category: SkillCategory.FRAMEWORK },
      { name: 'NextJS', category: SkillCategory.FRAMEWORK },
      { name: 'NuxtJS', category: SkillCategory.FRAMEWORK },
      { name: 'Django', category: SkillCategory.FRAMEWORK },
      { name: 'FastAPI', category: SkillCategory.FRAMEWORK },
      { name: 'Flask', category: SkillCategory.FRAMEWORK },
      { name: 'Laravel', category: SkillCategory.FRAMEWORK },
      { name: 'Express', category: SkillCategory.FRAMEWORK },
      { name: 'Fastify', category: SkillCategory.FRAMEWORK },
      { name: '.NET', category: SkillCategory.FRAMEWORK },
      { name: 'ASP.NET', category: SkillCategory.FRAMEWORK },
      { name: 'Ruby on Rails', category: SkillCategory.FRAMEWORK },
      { name: 'Gin', category: SkillCategory.FRAMEWORK },
      { name: 'Fiber', category: SkillCategory.FRAMEWORK },
      { name: 'Svelte', category: SkillCategory.FRAMEWORK },

      // Database
      { name: 'PostgreSQL', category: SkillCategory.DATABASE },
      { name: 'MySQL', category: SkillCategory.DATABASE },
      { name: 'MongoDB', category: SkillCategory.DATABASE },
      { name: 'Redis', category: SkillCategory.DATABASE },
      { name: 'Elasticsearch', category: SkillCategory.DATABASE },
      { name: 'SQLite', category: SkillCategory.DATABASE },
      { name: 'Cassandra', category: SkillCategory.DATABASE },
      { name: 'Neo4j', category: SkillCategory.DATABASE },
      { name: 'InfluxDB', category: SkillCategory.DATABASE },
      { name: 'MariaDB', category: SkillCategory.DATABASE },
      { name: 'Oracle DB', category: SkillCategory.DATABASE },
      { name: 'SQL Server', category: SkillCategory.DATABASE },
      { name: 'DynamoDB', category: SkillCategory.DATABASE },
      { name: 'Supabase', category: SkillCategory.DATABASE },

      // DevOps
      { name: 'Docker', category: SkillCategory.DEVOPS },
      { name: 'Kubernetes', category: SkillCategory.DEVOPS },
      { name: 'CI/CD', category: SkillCategory.DEVOPS },
      { name: 'Linux', category: SkillCategory.DEVOPS },
      { name: 'Nginx', category: SkillCategory.DEVOPS },
      { name: 'Terraform', category: SkillCategory.DEVOPS },
      { name: 'Ansible', category: SkillCategory.DEVOPS },
      { name: 'Jenkins', category: SkillCategory.DEVOPS },
      { name: 'GitHub Actions', category: SkillCategory.DEVOPS },
      { name: 'GitLab CI', category: SkillCategory.DEVOPS },
      { name: 'Prometheus', category: SkillCategory.DEVOPS },
      { name: 'Grafana', category: SkillCategory.DEVOPS },
      { name: 'ELK Stack', category: SkillCategory.DEVOPS },
      { name: 'Helm', category: SkillCategory.DEVOPS },

      // Cloud
      { name: 'AWS', category: SkillCategory.CLOUD },
      { name: 'GCP', category: SkillCategory.CLOUD },
      { name: 'Azure', category: SkillCategory.CLOUD },
      { name: 'Firebase', category: SkillCategory.CLOUD },
      { name: 'Vercel', category: SkillCategory.CLOUD },
      { name: 'Cloudflare', category: SkillCategory.CLOUD },
      { name: 'DigitalOcean', category: SkillCategory.CLOUD },
      { name: 'Heroku', category: SkillCategory.CLOUD },

      // AI/ML
      { name: 'TensorFlow', category: SkillCategory.AI_ML },
      { name: 'PyTorch', category: SkillCategory.AI_ML },
      { name: 'Scikit-learn', category: SkillCategory.AI_ML },
      { name: 'OpenCV', category: SkillCategory.AI_ML },
      { name: 'Hugging Face', category: SkillCategory.AI_ML },
      { name: 'LangChain', category: SkillCategory.AI_ML },
      { name: 'Computer Vision', category: SkillCategory.AI_ML },
      { name: 'NLP', category: SkillCategory.AI_ML },
      { name: 'Reinforcement Learning', category: SkillCategory.AI_ML },
      { name: 'MLflow', category: SkillCategory.AI_ML },
      { name: 'YOLO', category: SkillCategory.AI_ML },
      { name: 'Stable Diffusion', category: SkillCategory.AI_ML },
      { name: 'LLM', category: SkillCategory.AI_ML },
      { name: 'RAG', category: SkillCategory.AI_ML },
      { name: 'Keras', category: SkillCategory.AI_ML },

      // Data
      { name: 'Pandas', category: SkillCategory.DATA },
      { name: 'NumPy', category: SkillCategory.DATA },
      { name: 'Spark', category: SkillCategory.DATA },
      { name: 'Hadoop', category: SkillCategory.DATA },
      { name: 'Tableau', category: SkillCategory.DATA },
      { name: 'Power BI', category: SkillCategory.DATA },
      { name: 'Airflow', category: SkillCategory.DATA },
      { name: 'dbt', category: SkillCategory.DATA },
      { name: 'Kafka', category: SkillCategory.DATA },
      { name: 'Flink', category: SkillCategory.DATA },
      { name: 'Snowflake', category: SkillCategory.DATA },
      { name: 'BigQuery', category: SkillCategory.DATA },
      { name: 'Looker', category: SkillCategory.DATA },
      { name: 'Metabase', category: SkillCategory.DATA },

      // Cybersecurity
      { name: 'Penetration Testing', category: SkillCategory.CYBERSECURITY },
      { name: 'Network Security', category: SkillCategory.CYBERSECURITY },
      { name: 'OWASP', category: SkillCategory.CYBERSECURITY },
      { name: 'Cryptography', category: SkillCategory.CYBERSECURITY },
      { name: 'SOC', category: SkillCategory.CYBERSECURITY },
      { name: 'Ethical Hacking', category: SkillCategory.CYBERSECURITY },
      { name: 'Malware Analysis', category: SkillCategory.CYBERSECURITY },
      { name: 'Burp Suite', category: SkillCategory.CYBERSECURITY },
      { name: 'Wireshark', category: SkillCategory.CYBERSECURITY },
      { name: 'Metasploit', category: SkillCategory.CYBERSECURITY },
      { name: 'Reverse Engineering', category: SkillCategory.CYBERSECURITY },
      { name: 'CTF', category: SkillCategory.CYBERSECURITY },
      { name: 'Zero Trust', category: SkillCategory.CYBERSECURITY },
      { name: 'SIEM', category: SkillCategory.CYBERSECURITY },

      // Mobile
      { name: 'Flutter', category: SkillCategory.MOBILE },
      { name: 'React Native', category: SkillCategory.MOBILE },
      { name: 'Android', category: SkillCategory.MOBILE },
      { name: 'iOS', category: SkillCategory.MOBILE },
      { name: 'Jetpack Compose', category: SkillCategory.MOBILE },
      { name: 'SwiftUI', category: SkillCategory.MOBILE },
      { name: 'Xamarin', category: SkillCategory.MOBILE },

      // Embedded
      { name: 'Arduino', category: SkillCategory.EMBEDDED },
      { name: 'Raspberry Pi', category: SkillCategory.EMBEDDED },
      { name: 'STM32', category: SkillCategory.EMBEDDED },
      { name: 'ESP32', category: SkillCategory.EMBEDDED },
      { name: 'RTOS', category: SkillCategory.EMBEDDED },
      { name: 'FreeRTOS', category: SkillCategory.EMBEDDED },
      { name: 'FPGA', category: SkillCategory.EMBEDDED },
      { name: 'VHDL', category: SkillCategory.EMBEDDED },
      { name: 'Verilog', category: SkillCategory.EMBEDDED },
      { name: 'CAN Bus', category: SkillCategory.EMBEDDED },
      { name: 'UART/SPI/I2C', category: SkillCategory.EMBEDDED },
      { name: 'Embedded Linux', category: SkillCategory.EMBEDDED },

      // Network
      { name: 'TCP/IP', category: SkillCategory.NETWORK },
      { name: 'DNS', category: SkillCategory.NETWORK },
      { name: 'HTTP/HTTPS', category: SkillCategory.NETWORK },
      { name: 'WebSocket', category: SkillCategory.NETWORK },
      { name: 'gRPC', category: SkillCategory.NETWORK },
      { name: 'REST API', category: SkillCategory.NETWORK },
      { name: 'GraphQL', category: SkillCategory.NETWORK },
      { name: 'VPN', category: SkillCategory.NETWORK },
      { name: 'Firewall', category: SkillCategory.NETWORK },
      { name: 'Load Balancing', category: SkillCategory.NETWORK },
      { name: 'Cisco', category: SkillCategory.NETWORK },
      { name: 'SDN', category: SkillCategory.NETWORK },
      { name: 'CCNA', category: SkillCategory.NETWORK },

      // Testing
      { name: 'Unit Testing', category: SkillCategory.TESTING },
      { name: 'Integration Testing', category: SkillCategory.TESTING },
      { name: 'Jest', category: SkillCategory.TESTING },
      { name: 'Cypress', category: SkillCategory.TESTING },
      { name: 'Selenium', category: SkillCategory.TESTING },
      { name: 'Postman', category: SkillCategory.TESTING },
      { name: 'JUnit', category: SkillCategory.TESTING },
      { name: 'Playwright', category: SkillCategory.TESTING },
      { name: 'k6', category: SkillCategory.TESTING },
      { name: 'SonarQube', category: SkillCategory.TESTING },

      // Soft Skill
      { name: 'Teamwork', category: SkillCategory.SOFT_SKILL },
      { name: 'Communication', category: SkillCategory.SOFT_SKILL },
      { name: 'Problem Solving', category: SkillCategory.SOFT_SKILL },
      { name: 'Agile/Scrum', category: SkillCategory.SOFT_SKILL },
      { name: 'Leadership', category: SkillCategory.SOFT_SKILL },
      { name: 'Time Management', category: SkillCategory.SOFT_SKILL },
      { name: 'Critical Thinking', category: SkillCategory.SOFT_SKILL },
    ];

    await this.skillRepository.save(skills);
  }

  public async findAll(): Promise<Skill[]> {
    return await this.skillRepository.find({
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  public async findByCategory(category: SkillCategory): Promise<Skill[]> {
    return await this.skillRepository.find({
      where: { category },
      order: { name: 'ASC' },
    });
  }
}

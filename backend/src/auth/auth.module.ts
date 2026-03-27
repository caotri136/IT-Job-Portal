// src/auth/auth.module
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.stragety';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from 'src/candidate/candidate.entity';
import { Employer } from 'src/employer/employer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Candidate, Employer]),
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}

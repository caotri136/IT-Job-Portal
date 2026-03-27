// src/auth/auth.service
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/user/dto/loginUser.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';
import { UpdateUserDto } from 'src/user/dto/updateUser.dto';
import { VerifyUserDto } from './dto/verifyUser.dto';
import { Candidate } from 'src/candidate/candidate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employer } from 'src/employer/employer.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtSerive: JwtService,
    private mailService: MailerService,
    @InjectRepository(Candidate)
    private candidateRepo: Repository<Candidate>, // ← thêm inject
    @InjectRepository(Employer)
    private employerRepo: Repository<Employer>,
  ) {}

  async signIn(data: LoginUserDto): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(data.email);

    if (!user) throw new UnauthorizedException('Wrong password or email !');

    if (!user.verified)
      throw new UnauthorizedException('Verify your account first !');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Wrong password or email !');
    }

    const token = await this.getTokens(user.id, user.email);
    user.refreshToken = await bcrypt.hash(token.refreshToken, 10);
    await this.userService.saveUser(user);
    return token;
  }

  async register(data: CreateUserDto) {
    try {
      // check this email exists
      const checkUser = await this.userService.findByEmail(data.email);
      if (checkUser != null && checkUser.verified == true) {
        throw new NotAcceptableException('Email has been used');
      }
      if (checkUser != null && checkUser.verified == false) {
        await this.userService.deleteUser(checkUser.id);
      }

      const otp = crypto.randomInt(100000, 999999).toString();
      const hashOtp = await bcrypt.hash(otp, 9);
      const expired_at = new Date(Date.now() + 3 * 60 * 1000);
      const hashPass = (await bcrypt.hash(data.password, 9)).toString();

      const user = await this.userService.create({
        ...data,
        password: hashPass,
      });

      user.otp = hashOtp;
      user.expired_at = expired_at;

      await this.userService.saveUser(user);

      await this.mailService.sendMail({
        to: data.email,
        subject: 'Verify your account',
        text: `Your OTP is ${otp}`,
      });

      return { message: 'OTP sent to email' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async verify(email: string, otp: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new NotFoundException();

    if (user.verified)
      throw new BadRequestException('Account already verified');

    if (!user.otp || !user.expired_at)
      throw new BadRequestException('No active OTP. Please request a new one');

    if (user.expired_at < new Date())
      throw new BadRequestException('OTP expired. Please request a new one');

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) throw new BadRequestException('Invalid OTP');

    user.verified = true;
    user.otp = null;
    user.expired_at = null;

    await this.userService.saveUser(user);

    // default all users are candidate first
    const candidate = new Candidate();
    candidate.id = user.id;
    await this.candidateRepo.save(candidate);

    return { message: 'Account verified successfully' };
  }

  private async getTokens(userId: string, email: string) {
    const [access_token, refreshToken] = await Promise.all([
      this.jwtSerive.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '1h' },
      ),
      this.jwtSerive.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
      ),
    ]);
    return { access_token, refreshToken };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);

    if (!user) throw new NotFoundException();

    if (!user.refreshToken) throw new ForbiddenException();

    const isMatch = await bcrypt.compare(refreshToken, user?.refreshToken);

    if (!isMatch) throw new ForbiddenException();

    const token = await this.getTokens(user?.id, user?.email);

    user.refreshToken = await bcrypt.hash(token.refreshToken, 10);
    await this.userService.saveUser(user);

    return token;
  }

  async logout(userId: string) {
    const user = await this.userService.findById(userId);
    if (user == null) throw new NotFoundException();
    user.refreshToken = null;
    await this.userService.saveUser(user);

    return { message: 'Logout successfully !' };
  }

  async updateProfile(userId: string, data: UpdateUserDto) {
    await this.userService.updateUser(userId, data);
    return { message: 'Update successfully !' };
  }

  async getProfile(userId: string) {
    const user = await this.userService.findById(userId);
    const isEmployer = await this.employerRepo.findOne({
      where: { id: userId },
    });
    return {
      name: user?.name,
      email: user?.email,
      birthday: user?.birthDay,
      role: isEmployer ? 'employer' : 'candidate',
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) return { message: 'If this email exists, OTP has been sent' };

    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = await bcrypt.hash(otp, 9);
    user.expired_at = new Date(Date.now() + 5 * 60 * 1000);

    await this.userService.saveUser(user);

    await this.mailService.sendMail({
      to: email,
      subject: 'Verify your account',
      text: `Your OTP is ${otp}`,
    });

    return { message: 'If this email exists, OTP has been sent' };
  }

  async forgotVerify(data: VerifyUserDto) {
    const user = await this.userService.findByEmail(data.email);

    if (!user || !user.otp || !user.expired_at)
      throw new BadRequestException('No active OTP. Please request a new one');

    if (user.expired_at < new Date())
      throw new BadRequestException('OTP expired');

    const isMatch = await bcrypt.compare(data.otp, user.otp);
    if (!isMatch) throw new BadRequestException('Invalid OTP');

    user.otp = null;
    user.expired_at = null;
    await this.userService.saveUser(user);

    // tạo reset token riêng
    const resetToken = await this.jwtSerive.signAsync(
      { sub: user.id, type: 'reset' },
      {
        secret: process.env.JWT_RESET_SECRET,
        expiresIn: '5m',
      },
    );

    return { reset_token: resetToken };
  }

  async resetPassword(token: string, newPassword: string) {
    let payload;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      payload = await this.jwtSerive.verifyAsync(token, {
        secret: process.env.JWT_RESET_SECRET,
      });
    } catch {
      throw new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (payload.type !== 'reset') throw new UnauthorizedException();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const user = await this.userService.findById(payload.sub);
    if (!user) throw new NotFoundException();

    user.password = await bcrypt.hash(newPassword, 9);
    // force logout mọi device
    user.refreshToken = null;

    await this.userService.saveUser(user);

    return { message: 'Passwotd reset successfully' };
  }
}

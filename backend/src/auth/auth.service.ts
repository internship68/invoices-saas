import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/user.entity.js";
import { Workspace } from "../workspaces/workspace.entity.js";
import bcrypt from "bcryptjs";
import { signUser } from "./jwt.util.js";

interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Workspace)
    private readonly workspacesRepo: Repository<Workspace>,
  ) {}

  async register(data: RegisterDto): Promise<User> {
    const existing = await this.usersRepo.findOne({ where: { email: data.email } });
    if (existing) {
      throw new UnauthorizedException("Email already in use");
    }
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = this.usersRepo.create({
      email: data.email,
      passwordHash,
      name: data.name,
    });
    const savedUser = await this.usersRepo.save(user);

    const workspace = this.workspacesRepo.create({
      name: data.name ? `${data.name}'s Workspace` : "My Workspace",
      owner: savedUser,
    });
    await this.workspacesRepo.save(workspace);

    return savedUser;
  }

  async validateUser(data: LoginDto): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { email: data.email } });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const match = await bcrypt.compare(data.password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return user;
  }

  async login(data: LoginDto): Promise<{ accessToken: string; user: User }> {
    const user = await this.validateUser(data);
    const accessToken = signUser(user);
    return { accessToken, user };
  }
}

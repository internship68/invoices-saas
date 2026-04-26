import { test } from "node:test";
import assert from "node:assert/strict";
import type { Repository } from "typeorm";
import { AuthService } from "../src/auth/auth.service.js";
import type { User } from "../src/users/user.entity.js";
import type { Workspace } from "../src/workspaces/workspace.entity.js";

function createMockUserRepo() {
  let savedUser: User | null = null;

  return {
    repo: {
      findOne: async ({ where }: { where: { email: string } }) =>
        savedUser?.email === where.email ? savedUser : null,
      create: (data: Partial<User>) => data as User,
      save: async (data: User) => {
        savedUser = { ...data, id: "user-1" } as User;
        return savedUser;
      },
    } as unknown as Repository<User>,
    getSavedUser: () => savedUser,
  };
}

test("AuthService.register creates a user and default workspace", async () => {
  const users = createMockUserRepo();
  let createdWorkspaceName = "";

  const workspaceRepo = {
    create: (data: Partial<Workspace>) => {
      createdWorkspaceName = data.name ?? "";
      return data as Workspace;
    },
    save: async (data: Workspace) => data,
  } as unknown as Repository<Workspace>;

  const service = new AuthService(users.repo, workspaceRepo);
  const user = await service.register({
    email: "demo@example.com",
    password: "strong-pass",
    name: "Demo User",
  });

  assert.equal(user.email, "demo@example.com");
  assert.equal(createdWorkspaceName, "Demo User's Workspace");
  assert.ok(users.getSavedUser()?.passwordHash);
});

test("AuthService.validateUser throws on wrong password", async () => {
  const usersRepo = {
    findOne: async () =>
      ({
        id: "user-1",
        email: "demo@example.com",
        passwordHash: "$2b$10$Yf8h2MUN2ZV67fD0gQ8v6uIABck65Hh2mIUTvJbUlSL2S1Bmtf4FC", // "correct-password"
      }) as User,
  } as unknown as Repository<User>;
  const workspaceRepo = {} as Repository<Workspace>;
  const service = new AuthService(usersRepo, workspaceRepo);

  await assert.rejects(
    () => service.validateUser({ email: "demo@example.com", password: "wrong-password" }),
    /Invalid credentials/,
  );
});

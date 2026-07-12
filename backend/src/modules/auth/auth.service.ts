import prisma from '../../config/db';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwt';

export const registerUser = async (data: any) => {
  const { email, password, firstName, lastName } = data;
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      // Default role is EMPLOYEE, status is ACTIVE per schema
    },
  });

  await prisma.activityLog.create({
    data: {
      action: 'CREATE',
      entityType: 'User',
      entityId: user.id,
      userId: user.id, // User created themselves in this context
      details: { message: 'User registered' }
    }
  });

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    token: generateToken(user.id, user.role),
  };
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (user.status === 'INACTIVE') {
    throw new Error('Account is inactive. Cannot login.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  await prisma.activityLog.create({
    data: {
      action: 'LOGIN',
      entityType: 'User',
      entityId: user.id,
      userId: user.id,
    }
  });

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    token: generateToken(user.id, user.role),
  };
};

export const validateSession = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.status === 'INACTIVE') {
    throw new Error('Invalid session or inactive user');
  }
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
};

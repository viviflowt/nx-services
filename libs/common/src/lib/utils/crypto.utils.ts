import bcrypt from 'bcryptjs';

export const hashSync = (value: string): string => {
  if (!value) {
    throw new Error('Value not be empty');
  }

  return bcrypt.hashSync(value, 10);
};

export const compareSync = (value: string, hash: string): boolean => {
  if (!hash || !value) return false;
  try {
    return bcrypt.compareSync(value, hash);
  } catch (err) {
    return false;
  }
};

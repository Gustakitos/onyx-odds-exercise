import UserModel from '../../../src/models/User';

describe('User Model', () => {
  describe('hash', () => {
    it('should hash a password successfully', async () => {
      const password = 'testPassword123';
      const hashedPassword = await UserModel.hash(password);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword.length).toBeGreaterThan(0);
      expect(hashedPassword).not.toBe(password);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await UserModel.hash(password);
      const hash2 = await UserModel.hash(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty password', async () => {
      const password = '';
      const hashedPassword = await UserModel.hash(password);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should handle long passwords', async () => {
      const password = 'a'.repeat(1000);
      const hashedPassword = await UserModel.hash(password);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should handle special characters in password', async () => {
      const password = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const hashedPassword = await UserModel.hash(password);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword.length).toBeGreaterThan(0);
    });
  });

  describe('compare', () => {
    it('should return true for correct password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await UserModel.hash(password);

      const isMatch = await UserModel.compare(password, hashedPassword);

      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword456';
      const hashedPassword = await UserModel.hash(password);

      const isMatch = await UserModel.compare(wrongPassword, hashedPassword);

      expect(isMatch).toBe(false);
    });

    it('should return false for empty password against hash', async () => {
      const password = 'testPassword123';
      const hashedPassword = await UserModel.hash(password);

      const isMatch = await UserModel.compare('', hashedPassword);

      expect(isMatch).toBe(false);
    });

    it('should return false for password against empty hash', async () => {
      const password = 'testPassword123';

      const isMatch = await UserModel.compare(password, '');

      expect(isMatch).toBe(false);
    });

    it('should be case sensitive', async () => {
      const password = 'TestPassword123';
      const hashedPassword = await UserModel.hash(password);

      const isMatchCorrect = await UserModel.compare('TestPassword123', hashedPassword);
      const isMatchWrong = await UserModel.compare('testpassword123', hashedPassword);

      expect(isMatchCorrect).toBe(true);
      expect(isMatchWrong).toBe(false);
    });

    it('should handle special characters correctly', async () => {
      const password = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const hashedPassword = await UserModel.hash(password);

      const isMatch = await UserModel.compare(password, hashedPassword);

      expect(isMatch).toBe(true);
    });

    it('should handle unicode characters correctly', async () => {
      const password = 'пароль123🔒';
      const hashedPassword = await UserModel.hash(password);

      const isMatch = await UserModel.compare(password, hashedPassword);

      expect(isMatch).toBe(true);
    });
  });

  describe('Integration tests', () => {
    it('should match password and hash', async () => {
      const password = 'consistencyTest123';
      const hash = await UserModel.hash(password);

      const isMatch = await UserModel.compare(password, hash);
      expect(isMatch).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should handle invalid hash format gracefully', async () => {
      const password = 'testPassword123';
      const invalidHash = 'invalid_hash_format';

      expect(await UserModel.compare(password, invalidHash)).toBe(false);
    });

    it('should handle null/undefined inputs gracefully', async () => {
      await expect(UserModel.hash(null as any)).rejects.toThrow('Password must be a valid string');
      await expect(UserModel.hash(undefined as any)).rejects.toThrow('Password must be a valid string');
      expect(await UserModel.compare(null as any, 'hash')).toBe(false);
      expect(await UserModel.compare('password', null as any)).toBe(false);
      expect(await UserModel.compare(undefined as any, 'hash')).toBe(false);
      expect(await UserModel.compare('password', undefined as any)).toBe(false);
    });
  });
});
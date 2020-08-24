export default interface ICacheProvider {
  save(key: string, value: any): Promise<void>;
  recover<T>(key: string): Promise<T | null>;
  invalidate(ket: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
}

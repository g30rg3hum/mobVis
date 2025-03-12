export class LocalStorageMock {
  storage: { [key: string]: string };

  constructor() {
    this.storage = {};
  }

  clear() {
    this.storage = {};
  }

  getItem(key: string) {
    return this.storage[key] || null;
  }

  setItem(key: string, value: string) {
    this.storage[key] = value;
  }

  removeItem(key: string) {
    delete this.storage[key];
  }

  key(index: number) {
    return Object.keys(this.storage)[index] || null;
  }

  get length() {
    return Object.keys(this.storage).length;
  }
}

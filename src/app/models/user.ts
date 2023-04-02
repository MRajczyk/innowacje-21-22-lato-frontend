export interface User {
  id: string;
  name: string;
  password: string;
  authorities: string[];
  groups: string;
  prohibitions: string;
}

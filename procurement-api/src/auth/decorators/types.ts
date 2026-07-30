import { UserRole } from '../../user/enum/userRole..enum';

export interface JwtPayload {
  uid: number;
  email: string;
  role: UserRole;
}

import { Dayjs } from "dayjs";

export type TUserData = {
    userId: number;
    name: string,
    email: string,
    password: string,
}
export type TUserCreateData = Omit<TUserData, "userId">;
export type TUserLoginData = Omit<TUserData, "name" | "userId">;
export type TUserEditData = Omit<TUserData, "password">;
export type TUserPasswordChange = Omit<TUserData, "name" | "email" | "password"> &
{ newPassword: string, currentPassword: string }

export type TExpenseData = {
    category: string;
    type: string;
    title: string;
    amount: number;
    userId: number;
    date: Dayjs | string | Date | null;
}
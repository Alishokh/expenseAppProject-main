export const enum EExpenseType {
    CHARGE = "charge",
    INCOME = "income",
}

export const ExpenseTypeData = [EExpenseType.CHARGE, EExpenseType.INCOME];

export const ExpenseChargeCategory: string[] = ["home", "car", "shopping", "food", "restaurants", "travels", "sport events", "other"]
export const ExpenseIncomeCategory: string[] = ["passive income", "salary", "other"]
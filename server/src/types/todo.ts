export interface UserTodo {
  id: string;
  user_id: string;
  purchase_id: string;
  routine_item_id: string;
  scheduled_date: string;
  completed_at: string | null;
  is_skipped: boolean;
}

export interface WeeklyTodoQuery {
  date: string; // YYYY-MM-DD, returns the week containing this date
}

export interface MonthlyTodoQuery {
  year: number;
  month: number;
}

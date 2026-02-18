export interface UserTodo {
  id: string;
  userId: string;
  purchaseId: string;
  routineItemId: string;
  routineTitle: string;
  itemTitle: string;
  itemDescription: string | null;
  scheduledDate: string;
  completedAt: string | null;
  isSkipped: boolean;
  dayNumber: number;
}

export interface DailyTodos {
  date: string;
  todos: UserTodo[];
  completedCount: number;
  totalCount: number;
}

export interface WeeklyProgress {
  weekStart: string;
  weekEnd: string;
  days: DailyTodos[];
  overallProgress: number;
}

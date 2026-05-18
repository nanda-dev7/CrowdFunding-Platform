export const calculateProgress = (raised = 0, goal = 1) =>
  Math.min(100, Math.round(((Number(raised) || 0) / Math.max(Number(goal) || 1, 1)) * 100));

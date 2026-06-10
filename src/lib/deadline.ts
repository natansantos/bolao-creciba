export function isPredictionAllowed(matchTime: string): boolean {
  const deadline = new Date(matchTime)
  deadline.setMinutes(deadline.getMinutes() - 30)
  return new Date() < deadline
}

export function getDeadline(matchTime: string): Date {
  const deadline = new Date(matchTime)
  deadline.setMinutes(deadline.getMinutes() - 30)
  return deadline
}

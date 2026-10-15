const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

const todayFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

export function formatToday() {
  return todayFormatter.format(new Date());
}

export function formatFileSize(sizeBytes: number) {
  if (sizeBytes < 1_000_000) return `${Math.max(1, Math.round(sizeBytes / 1_000))} KB`;
  return `${(sizeBytes / 1_000_000).toFixed(1)} MB`;
}
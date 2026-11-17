import { format, isToday, isYesterday, parseISO } from 'date-fns';

export function formatMessageTime(isoString: string): string {
  try {
    return format(parseISO(isoString), 'h:mm a');
  } catch {
    return '';
  }
}

export function formatSidebarTime(isoString: string): string {
  try {
    const date = parseISO(isoString);
    if (isToday(date)) return format(date, 'h:mm a');
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d');
  } catch {
    return '';
  }
}

export function formatDateHeader(isoString: string): string {
  try {
    const date = parseISO(isoString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM d, yyyy');
  } catch {
    return 'Recent';
  }
}

export function getDateKey(isoString: string): string {
  try {
    return format(parseISO(isoString), 'yyyy-MM-dd');
  } catch {
    return 'unknown';
  }
}
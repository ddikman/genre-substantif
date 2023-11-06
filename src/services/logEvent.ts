declare function gtag(...args: any[]): void;

export function logEvent(event: string, data: any) {
  gtag('event', event, data);
}
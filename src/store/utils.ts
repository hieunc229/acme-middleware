export function getFutureDate(days: number) {
    let date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}
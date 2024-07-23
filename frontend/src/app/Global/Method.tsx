export function Move(id: string) {
    document.getElementById(id)?.focus();
}
export function KeyDownCheck({ preKey, setPreKey, e, pre, next }: { preKey: string, setPreKey: (value: any) => void, e: any, pre?: () => void, next?: () => void }) {
    if (pre && preKey != '' && e.key == 'Enter')
        pre();
    else if (next && preKey == '' && e.key == 'Enter')
        next();
    if (e.key == 'Shift')
        setPreKey('Shift');
    else if (preKey != null)
        setPreKey('');
}
export function checkInput(check: any, pattern: string, True: () => void, False: () => void) {
    if (new RegExp(pattern).test(check.target.value))
        True();
    else
        False();
}
export function Check(pattern: string, test: string) {
    return new RegExp(pattern).test(test);
}
export function MonthDate() {
    const now = new Date();
    let week = ''
    switch ((now.getDay() + 2) % 7) {
        case 0: week = 'Sun'; break;
        case 1: week = 'Mon'; break;
        case 2: week = 'Tue'; break;
        case 3: week = 'Wed'; break;
        case 4: week = 'Thr'; break;
        case 5: week = 'Fri'; break;
        case 6: week = 'Set'; break;
    }
    return (now.getMonth() + 1) + '/' + (now.getDate() + 2) + '(' + week + ')';
}
export function getDate(data: any) {
    const date = new Date(data);
    return date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate();
}
export function getDateTime(data: any) {
    const date = new Date(data);
    return date.getFullYear() + "" + (date.getMonth() + 1) + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes();
}
export function getDateTimeFormat(data: any) {
    const date = new Date(data);
    return date.getFullYear() + "-" + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + " " + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
}
export function getDateFormat(data: any) {
    const date = new Date(data);
    return date.getFullYear() + "-" + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
}
export function getTimeFormat(data: any) {
    const date = new Date(data);
    let hours = date.getHours();
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hour from 24-hour to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    // Format hour as two digits
    const formattedHours = hours < 10 ? '0' + hours : hours;
    
    return ampm + " " + formattedHours + ":" + minutes + " ";
}


export function getDateTimeFormatInput(data: any) {
    const date = new Date(data);
    return date.getFullYear() + "-" + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + "T" + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
}
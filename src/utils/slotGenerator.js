export const generateSlots = (start, end) => {
    const slots = [];
    let [ hour, minute ] = start.split(":").map(Number);

    while (true) {
        const startStr = `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;

        minute += 30;
        if (minute >= 60) {
            hour += 1;
            minute -= 60;
        }

        const endStr = `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;

        if (endStr > end) break;

        slots.push({ start: startStr, end: endStr });
    }

    return slots;
};

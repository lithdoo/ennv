import { TaskStatus } from "@/utils/task";

export const statusColor = (status: TaskStatus, op: number = 1) => {
    switch (status) {
        case TaskStatus.undo:
            return `rgba(107, 170, 179,${op * 255})`;
        case TaskStatus.preparing:
            return `rgba(1, 186, 239,${op * 255})`
        case TaskStatus.pendding:
            return `rgba(255,126,71,${op * 255})`
        case TaskStatus.error:
            return `rgba(218,27,43,${op * 255})`
        case TaskStatus.completed:
            return `rgba(0,255,197,${op * 255})`
        case TaskStatus.canceled:
            return `rgba(118,124,167,${op * 255})`
    }
}
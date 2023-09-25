"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.EnActions = void 0;
class EnActions {
    all = new Map();
    regist(key, option, createHandler) {
        this.all.set(key, { key, option, createHandler: createHandler });
    }
}
exports.EnActions = EnActions;
exports.actions = (() => {
    if ((typeof window !== 'undefined') && window['__en_actions__'] && window['en_actions']) {
        return window['en_actions'];
    }
    else {
        window['__en_actions__'] = true;
        return window['en_actions'] = new EnActions();
    }
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBK0NBLE1BQWEsU0FBUztJQUNsQixHQUFHLEdBSUUsSUFBSSxHQUFHLEVBQUUsQ0FBQTtJQUVkLE1BQU0sQ0FBQyxHQUFXLEVBQUUsTUFBc0IsRUFBRSxhQUE0QjtRQUNwRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFBO0lBQ3BFLENBQUM7Q0FDSjtBQVZELDhCQVVDO0FBU1ksUUFBQSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUU7SUFDekIsSUFBSSxDQUFDLE9BQU8sTUFBTSxLQUFLLFdBQVcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRTtRQUNyRixPQUFPLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUMvQjtTQUFNO1FBQ0gsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsSUFBSSxDQUFBO1FBQy9CLE9BQU8sTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUE7S0FDaEQ7QUFDTCxDQUFDLENBQUMsRUFBRSxDQUFBIn0=
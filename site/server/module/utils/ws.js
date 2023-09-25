export class WsMsgConnectCenter {
    connects = new Map();
    add(connect) {
        const { connectId } = connect;
        if (this.connects.has(connectId)) {
            throw new Error('connectId has been used!');
        }
        this.connects.set(connectId, connect);
    }
    cancel(connectId) {
        const connect = this.connects.get(connectId);
        if (!connect)
            return;
        connect.expire = new Date().getTime() + 1000 * 60;
    }
    remove(connectId) {
        const connect = this.connects.get(connectId);
        if (!connect)
            return;
        this.connects.delete(connectId);
        connect.destroy();
    }
}
export class WsMsgConnect {
    expire = Infinity; // 过期时间
    task = [];
    connectId = '';
    destroy() { }
}
var ConnectTaskStatus;
(function (ConnectTaskStatus) {
    ConnectTaskStatus[ConnectTaskStatus["opened"] = 0] = "opened";
    ConnectTaskStatus[ConnectTaskStatus["preding"] = 1] = "preding";
    ConnectTaskStatus[ConnectTaskStatus["error"] = 2] = "error";
    ConnectTaskStatus[ConnectTaskStatus["completed"] = 3] = "completed";
})(ConnectTaskStatus || (ConnectTaskStatus = {}));
export class ConnectTask {
    status = ConnectTaskStatus.opened;
    connextId = '';
    taskId = '';
    cancel() { }
    error() { }
    complete() { }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvd3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxPQUFPLGtCQUFrQjtJQUMzQixRQUFRLEdBQThCLElBQUksR0FBRyxFQUFFLENBQUE7SUFDL0MsR0FBRyxDQUFDLE9BQXFCO1FBQ3JCLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxPQUFPLENBQUE7UUFDN0IsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM5QixNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUE7U0FDOUM7UUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDekMsQ0FBQztJQUVELE1BQU0sQ0FBQyxTQUFpQjtRQUNwQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUM1QyxJQUFJLENBQUMsT0FBTztZQUFFLE9BQU07UUFDcEIsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7SUFDckQsQ0FBQztJQUVELE1BQU0sQ0FBQyxTQUFpQjtRQUNwQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUM1QyxJQUFJLENBQUMsT0FBTztZQUFFLE9BQU07UUFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDL0IsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBQ3JCLENBQUM7Q0FDSjtBQUVELE1BQU0sT0FBTyxZQUFZO0lBQ3JCLE1BQU0sR0FBVyxRQUFRLENBQUEsQ0FBQyxPQUFPO0lBQ2pDLElBQUksR0FBa0IsRUFBRSxDQUFBO0lBQ3hCLFNBQVMsR0FBVyxFQUFFLENBQUE7SUFDdEIsT0FBTyxLQUFLLENBQUM7Q0FDaEI7QUFHRCxJQUFLLGlCQUtKO0FBTEQsV0FBSyxpQkFBaUI7SUFDbEIsNkRBQU0sQ0FBQTtJQUNOLCtEQUFPLENBQUE7SUFDUCwyREFBSyxDQUFBO0lBQ0wsbUVBQVMsQ0FBQTtBQUNiLENBQUMsRUFMSSxpQkFBaUIsS0FBakIsaUJBQWlCLFFBS3JCO0FBQ0QsTUFBTSxPQUFPLFdBQVc7SUFDcEIsTUFBTSxHQUFzQixpQkFBaUIsQ0FBQyxNQUFNLENBQUE7SUFDcEQsU0FBUyxHQUFXLEVBQUUsQ0FBQTtJQUN0QixNQUFNLEdBQVcsRUFBRSxDQUFBO0lBRW5CLE1BQU0sS0FBSyxDQUFDO0lBQ1osS0FBSyxLQUFLLENBQUM7SUFDWCxRQUFRLEtBQUssQ0FBQztDQUNqQiJ9
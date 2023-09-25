import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { wss } from './ws/connect';
import { request } from './request/index';
import { loadList } from './request/load';
import { diskHandler } from './request/file';
export { taskManager } from './request/task';
export class EnnvServer {
    app = new Koa();
    constructor() {
        const router = request(this);
        this.app
            .use(bodyParser())
            .use(router.allowedMethods())
            .use(router.routes());
    }
    loadFileDisk(fd) {
        diskHandler.regist(fd);
    }
    useMiddleware(middleware) {
        this.app.use(middleware);
    }
    setExtraFiles({ scripts, stylesheets }) {
        loadList.scripts = loadList.scripts.concat(scripts ?? []);
        loadList.scripts = loadList.scripts.concat(stylesheets ?? []);
    }
    listen(port) {
        wss(this.app, port);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxHQUFHLE1BQU0sS0FBSyxDQUFBO0FBQ3JCLE9BQU8sVUFBVSxNQUFNLGdCQUFnQixDQUFBO0FBRXZDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDbkMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUcxQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFN0MsT0FBTyxFQUFFLFdBQVcsRUFBcUIsTUFBTSxnQkFBZ0IsQ0FBQTtBQUUvRCxNQUFNLE9BQU8sVUFBVTtJQUNuQixHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtJQUNmO1FBQ0ksTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzVCLElBQUksQ0FBQyxHQUFHO2FBQ0gsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDO2FBQ2pCLEdBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7YUFDNUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO0lBRTdCLENBQUM7SUFDRCxZQUFZLENBQUksRUFBZ0I7UUFDN0IsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUN6QixDQUFDO0lBQ0QsYUFBYSxDQUFDLFVBQXFFO1FBQy9FLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQzVCLENBQUM7SUFDRCxhQUFhLENBQUMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUduQztRQUNHLFFBQVEsQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQ3pELFFBQVEsQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQyxDQUFBO0lBQ2pFLENBQUM7SUFDRCxNQUFNLENBQUMsSUFBWTtRQUNmLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ3ZCLENBQUM7Q0FDSiJ9
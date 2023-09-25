/// <reference types="node" />
import Router from "koa-router";
import { WebSocket } from 'ws';
import Koa from 'koa';
export declare class WsConnext {
    static all: Map<string, WsConnext>;
    static cache: Map<string, {
        timeout: NodeJS.Timeout;
        messages: string[];
    }>;
    static send(id: string, message: string): void;
    connextId: string;
    ws: WebSocket;
    constructor(id: string, ws: WebSocket);
    regist(): void;
    destroy(): void;
    send(msg: string): void;
    ping(): void;
}
export declare const connect: Router<any, {}>;
export declare const wss: (app: Koa, port: number) => void;

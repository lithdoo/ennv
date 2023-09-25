import SysTray, { ClickEvent } from "@ennv/systray";
export declare const tray: {
    systray?: SysTray | undefined;
    actions(): ({
        title: string;
        tooltip: string;
        checked: boolean;
        enabled: boolean;
        on?: undefined;
    } | {
        title: string;
        tooltip: string;
        checked: boolean;
        enabled: boolean;
        on: () => void;
    })[];
    events(): (e: ClickEvent) => void;
    icon(): Promise<string>;
    items(): Promise<{
        title: string;
        tooltip: string;
        checked: boolean;
        enabled: boolean;
    }[]>;
    init(): Promise<void>;
    kill(): Promise<void>;
};

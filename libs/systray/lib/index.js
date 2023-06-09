"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var child = require("child_process");
var path = require("path");
var os = require("os");
var fs = require("fs-extra");
var events_1 = require("events");
var readline = require("readline");
var Debug = require("debug");
var pkg = require('../package.json');
var debug = Debug(pkg.name);
var getTrayBinPath = function (debug, copyDir) {
    if (debug === void 0) { debug = false; }
    if (copyDir === void 0) { copyDir = false; }
    var binName = ({
        win32: "tray_windows".concat(debug ? '' : '_release', ".exe"),
        darwin: "tray_darwin".concat(debug ? '' : '_release'),
        linux: "tray_linux".concat(debug ? '' : '_release'),
    })[process.platform];
    var binPath = path.resolve("".concat(__dirname, "/../traybin/").concat(binName));
    if (copyDir) {
        copyDir = path.join((typeof copyDir === 'string'
            ? copyDir
            : "".concat(os.homedir(), "/.cache/node-systray/")), pkg.version);
        var copyDistPath = path.join(copyDir, binName);
        if (!fs.existsSync(copyDistPath)) {
            fs.ensureDirSync(copyDir);
            fs.copySync(binPath, copyDistPath);
        }
        return copyDistPath;
    }
    return binPath;
};
var CHECK_STR = ' (√)';
function updateCheckedInLinux(item) {
    if (process.platform !== 'linux') {
        return item;
    }
    if (item.checked) {
        item.title += CHECK_STR;
    }
    else {
        item.title = (item.title || '').replace(RegExp(CHECK_STR + '$'), '');
    }
    return item;
}
var SysTray = /** @class */ (function (_super) {
    __extends(SysTray, _super);
    function SysTray(conf) {
        var _this = _super.call(this) || this;
        _this._conf = conf;
        _this._binPath = getTrayBinPath(conf.debug, conf.copyDir);
        _this._process = child.spawn(_this._binPath, [], {
            windowsHide: true
        });
        _this._rl = readline.createInterface({
            input: _this._process.stdout,
        });
        conf.menu.items = conf.menu.items.map(updateCheckedInLinux);
        _this._rl.on('line', function (data) { return debug('onLine', data); });
        _this.onReady(function () { return _this.writeLine(JSON.stringify(conf.menu)); });
        return _this;
    }
    SysTray.prototype.onReady = function (listener) {
        this._rl.on('line', function (line) {
            var action = JSON.parse(line);
            if (action.type === 'ready') {
                listener();
                debug('onReady', action);
            }
        });
        return this;
    };
    SysTray.prototype.onClick = function (listener) {
        this._rl.on('line', function (line) {
            var action = JSON.parse(line);
            if (action.type === 'clicked') {
                debug('onClick', action);
                listener(action);
            }
        });
        return this;
    };
    SysTray.prototype.writeLine = function (line) {
        var _a;
        if (line) {
            debug('writeLine', line + '\n', '=====');
            (_a = this._process.stdin) === null || _a === void 0 ? void 0 : _a.write(line.trim() + '\n');
        }
        return this;
    };
    SysTray.prototype.sendAction = function (action) {
        switch (action.type) {
            case 'update-item':
                action.item = updateCheckedInLinux(action.item);
                break;
            case 'update-menu':
                action.menu.items = action.menu.items.map(updateCheckedInLinux);
                break;
            case 'update-menu-and-item':
                action.menu.items = action.menu.items.map(updateCheckedInLinux);
                action.item = updateCheckedInLinux(action.item);
                break;
        }
        debug('sendAction', action);
        this.writeLine(JSON.stringify(action));
        return this;
    };
    /**
     * Kill the systray process
     * @param exitNode Exit current node process after systray process is killed, default is true
     */
    SysTray.prototype.kill = function (exitNode) {
        if (exitNode === void 0) { exitNode = true; }
        if (exitNode) {
            this.onExit(function () { return process.exit(0); });
        }
        this._rl.close();
        this._process.kill();
    };
    SysTray.prototype.onExit = function (listener) {
        this._process.on('exit', listener);
    };
    SysTray.prototype.onError = function (listener) {
        var _this = this;
        this._process.on('error', function (err) {
            debug('onError', err, 'binPath', _this.binPath);
            listener(err);
        });
    };
    Object.defineProperty(SysTray.prototype, "killed", {
        get: function () {
            return this._process.killed;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SysTray.prototype, "binPath", {
        get: function () {
            return this._binPath;
        },
        enumerable: false,
        configurable: true
    });
    return SysTray;
}(events_1.EventEmitter));
exports.default = SysTray;
//# sourceMappingURL=index.js.map
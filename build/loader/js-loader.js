"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simple_resource_loader_1 = __importDefault(require("./simple-resource-loader"));
class JSLoader extends simple_resource_loader_1.default {
    constructor() {
        super(...arguments);
        this.doAppend = () => {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.appendChild(document.createTextNode(this.responseData));
            document.body.appendChild(script);
        };
    }
}
exports.default = JSLoader;

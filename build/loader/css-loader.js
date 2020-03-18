"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simple_resource_loader_1 = __importDefault(require("./simple-resource-loader"));
class CSSLoader extends simple_resource_loader_1.default {
    constructor() {
        super(...arguments);
        this.doAppend = () => {
            const style = document.createElement('style');
            style.appendChild(document.createTextNode(this.responseData));
            let head = document.head;
            if (!head) {
                head = document.createElement('head');
                document.appendChild(head);
            }
            head.appendChild(style);
        };
    }
}
exports.default = CSSLoader;

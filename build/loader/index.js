"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simple_resource_loader_1 = __importDefault(require("./simple-resource-loader"));
exports.SimpleResourceLoader = simple_resource_loader_1.default;
const multi_resource_loader_1 = __importDefault(require("./multi-resource-loader"));
exports.MultiResourceLoader = multi_resource_loader_1.default;
const css_loader_1 = __importDefault(require("./css-loader"));
exports.CSSLoader = css_loader_1.default;
const js_loader_1 = __importDefault(require("./js-loader"));
exports.JSLoader = js_loader_1.default;

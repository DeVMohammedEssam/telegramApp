"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
var api_1 = __importDefault(require("../tl/api"));
// @ts-ignore
var Helpers_1 = require("../Helpers");
// @ts-ignore
var Utils_1 = require("../Utils");
var KB_TO_BYTES = 1024;
var LARGE_FILE_THRESHOLD = 10 * 1024 * 1024;
var UPLOAD_TIMEOUT = 15 * 1000;
function uploadFile(client, fileParams) {
    return __awaiter(this, void 0, void 0, function () {
        var file, onProgress, workers, name, size, fileId, isLarge, partSize, partCount, buffer, _a, _b, sender, progress, i, sendingParts, end, _loop_1, j, _c, _d, err_1;
        var _this = this;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    file = fileParams.file, onProgress = fileParams.onProgress;
                    workers = fileParams.workers;
                    name = file.name, size = file.size;
                    fileId = Helpers_1.readBigIntFromBuffer(Helpers_1.generateRandomBytes(8), true, true);
                    isLarge = size > LARGE_FILE_THRESHOLD;
                    partSize = Utils_1.getAppropriatedPartSize(size) * KB_TO_BYTES;
                    partCount = Math.floor((size + partSize - 1) / partSize);
                    _b = (_a = Buffer).from;
                    return [4 /*yield*/, fileToBuffer(file)];
                case 1:
                    buffer = _b.apply(_a, [_e.sent()]);
                    return [4 /*yield*/, client._borrowExportedSender(client.session.dcId)];
                case 2:
                    sender = _e.sent();
                    if (!workers || !size) {
                        workers = 1;
                    }
                    if (workers >= partCount) {
                        workers = partCount;
                    }
                    progress = 0;
                    if (onProgress) {
                        onProgress(progress);
                    }
                    i = 0;
                    _e.label = 3;
                case 3:
                    if (!(i < partCount)) return [3 /*break*/, 9];
                    sendingParts = [];
                    end = i + workers;
                    if (end > partCount) {
                        end = partCount;
                    }
                    _loop_1 = function (j) {
                        var bytes = buffer.slice(j * partSize, (j + 1) * partSize);
                        sendingParts.push((function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sender.send(isLarge
                                            ? new api_1.default.upload.SaveBigFilePart({
                                                fileId: fileId,
                                                filePart: j,
                                                fileTotalParts: partCount,
                                                bytes: bytes,
                                            })
                                            : new api_1.default.upload.SaveFilePart({
                                                fileId: fileId,
                                                filePart: j,
                                                bytes: bytes,
                                            }))];
                                    case 1:
                                        _a.sent();
                                        if (onProgress) {
                                            if (onProgress.isCanceled) {
                                                throw new Error('USER_CANCELED');
                                            }
                                            progress += (1 / partCount);
                                            onProgress(progress);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); })());
                    };
                    for (j = i; j < end; j++) {
                        _loop_1(j);
                    }
                    _e.label = 4;
                case 4:
                    _e.trys.push([4, 7, , 8]);
                    _d = (_c = Promise).race;
                    return [4 /*yield*/, Promise.all(sendingParts)];
                case 5: return [4 /*yield*/, _d.apply(_c, [[
                            _e.sent(),
                            Helpers_1.sleep(UPLOAD_TIMEOUT * workers).then(function () { return Promise.reject(new Error('TIMEOUT')); })
                        ]])];
                case 6:
                    _e.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _e.sent();
                    if (err_1.message === 'TIMEOUT') {
                        console.warn('Upload timeout. Retrying...');
                        i -= workers;
                        return [3 /*break*/, 8];
                    }
                    throw err_1;
                case 8:
                    i += workers;
                    return [3 /*break*/, 3];
                case 9: return [2 /*return*/, isLarge
                        ? new api_1.default.InputFileBig({
                            id: fileId,
                            parts: partCount,
                            name: name,
                        })
                        : new api_1.default.InputFile({
                            id: fileId,
                            parts: partCount,
                            name: name,
                            md5Checksum: '',
                        })];
            }
        });
    });
}
exports.uploadFile = uploadFile;
function generateRandomBigInt() {
    return Helpers_1.readBigIntFromBuffer(Helpers_1.generateRandomBytes(8), false);
}
function fileToBuffer(file) {
    return new Response(file).arrayBuffer();
}

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
exports.downloadFile = void 0;
var api_1 = __importDefault(require("../tl/api"));
// @ts-ignore
var Utils_1 = require("../Utils");
// @ts-ignore
var Helpers_1 = require("../Helpers");
// Chunk sizes for `upload.getFile` must be multiple of the smallest size
var MIN_CHUNK_SIZE = 4096;
var DEFAULT_CHUNK_SIZE = 64; // kb
var ONE_MB = 1024 * 1024;
var REQUEST_TIMEOUT = 15000;
function downloadFile(client, inputLocation, fileParams) {
    return __awaiter(this, void 0, void 0, function () {
        var partSizeKb, fileSize, _a, workers, end, dcId, progressCallback, _b, start, partSize, partsCount, sender, e_1, foreman, promises, offset, hasEnded, progress, _loop_1, state_1, results, buffers, totalLength;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    partSizeKb = fileParams.partSizeKb, fileSize = fileParams.fileSize, _a = fileParams.workers, workers = _a === void 0 ? 1 : _a, end = fileParams.end;
                    dcId = fileParams.dcId, progressCallback = fileParams.progressCallback, _b = fileParams.start, start = _b === void 0 ? 0 : _b;
                    end = end && end < fileSize ? end : fileSize - 1;
                    if (!partSizeKb) {
                        partSizeKb = fileSize ? Utils_1.getAppropriatedPartSize(fileSize) : DEFAULT_CHUNK_SIZE;
                    }
                    partSize = partSizeKb * 1024;
                    partsCount = end ? Math.ceil((end - start) / partSize) : 1;
                    if (partSize % MIN_CHUNK_SIZE !== 0) {
                        throw new Error("The part size must be evenly divisible by " + MIN_CHUNK_SIZE);
                    }
                    if (!dcId) return [3 /*break*/, 5];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client._borrowExportedSender(dcId)];
                case 2:
                    sender = _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _c.sent();
                    // This should never raise
                    client._log.error(e_1);
                    if (e_1.message === 'DC_ID_INVALID') {
                        // Can't export a sender for the ID we are currently in
                        sender = client._sender;
                    }
                    else {
                        throw e_1;
                    }
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    sender = client._sender;
                    _c.label = 6;
                case 6:
                    client._log.info("Downloading file in chunks of " + partSize + " bytes");
                    foreman = new Foreman(workers);
                    promises = [];
                    offset = start;
                    hasEnded = false;
                    progress = 0;
                    if (progressCallback) {
                        progressCallback(progress);
                    }
                    _loop_1 = function () {
                        var limit, isPrecise;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    limit = partSize;
                                    isPrecise = false;
                                    if (Math.floor(offset / ONE_MB) !== Math.floor((offset + limit - 1) / ONE_MB)) {
                                        limit = ONE_MB - offset % ONE_MB;
                                        isPrecise = true;
                                    }
                                    return [4 /*yield*/, foreman.requestWorker()];
                                case 1:
                                    _a.sent();
                                    if (!hasEnded) return [3 /*break*/, 3];
                                    return [4 /*yield*/, foreman.releaseWorker()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/, "break"];
                                case 3:
                                    promises.push((function () { return __awaiter(_this, void 0, void 0, function () {
                                        var result, _a, _b, err_1;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0:
                                                    _c.trys.push([0, 3, 4, 5]);
                                                    _b = (_a = Promise).race;
                                                    return [4 /*yield*/, sender.send(new api_1.default.upload.GetFile({
                                                            location: inputLocation,
                                                            offset: offset,
                                                            limit: limit,
                                                            precise: isPrecise || undefined,
                                                        }))];
                                                case 1: return [4 /*yield*/, _b.apply(_a, [[
                                                            _c.sent(),
                                                            Helpers_1.sleep(REQUEST_TIMEOUT).then(function () { return Promise.reject(new Error('REQUEST_TIMEOUT')); })
                                                        ]])];
                                                case 2:
                                                    result = _c.sent();
                                                    if (progressCallback) {
                                                        if (progressCallback.isCanceled) {
                                                            throw new Error('USER_CANCELED');
                                                        }
                                                        progress += (1 / partsCount);
                                                        progressCallback(progress);
                                                    }
                                                    if (!end && (result.bytes.length < limit)) {
                                                        hasEnded = true;
                                                    }
                                                    return [2 /*return*/, result.bytes];
                                                case 3:
                                                    err_1 = _c.sent();
                                                    hasEnded = true;
                                                    throw err_1;
                                                case 4:
                                                    foreman.releaseWorker();
                                                    return [7 /*endfinally*/];
                                                case 5: return [2 /*return*/];
                                            }
                                        });
                                    }); })());
                                    offset += limit;
                                    if (end && (offset > end)) {
                                        return [2 /*return*/, "break"];
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _c.label = 7;
                case 7:
                    if (!true) return [3 /*break*/, 9];
                    return [5 /*yield**/, _loop_1()];
                case 8:
                    state_1 = _c.sent();
                    if (state_1 === "break")
                        return [3 /*break*/, 9];
                    return [3 /*break*/, 7];
                case 9: return [4 /*yield*/, Promise.all(promises)];
                case 10:
                    results = _c.sent();
                    buffers = results.filter(Boolean);
                    totalLength = end ? (end + 1) - start : undefined;
                    return [2 /*return*/, Buffer.concat(buffers, totalLength)];
            }
        });
    });
}
exports.downloadFile = downloadFile;
var Foreman = /** @class */ (function () {
    function Foreman(maxWorkers) {
        this.maxWorkers = maxWorkers;
        this.activeWorkers = 0;
    }
    Foreman.prototype.requestWorker = function () {
        this.activeWorkers++;
        if (this.activeWorkers > this.maxWorkers) {
            this.deferred = createDeferred();
            return this.deferred.promise;
        }
        return Promise.resolve();
    };
    Foreman.prototype.releaseWorker = function () {
        this.activeWorkers--;
        if (this.deferred && (this.activeWorkers <= this.maxWorkers)) {
            this.deferred.resolve();
        }
    };
    return Foreman;
}());
function createDeferred() {
    var resolve;
    var promise = new Promise(function (_resolve) {
        resolve = _resolve;
    });
    return {
        promise: promise,
        resolve: resolve,
    };
}

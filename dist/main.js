"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
// ============================= 导入
// ============================= 类型
var EFile;
(function (EFile) {
    EFile["2D"] = "2d";
    EFile["3D"] = "3d";
    EFile["JSON"] = "json";
})(EFile || (EFile = {}));
// ============================= 常量
var READ_PATH = 'E:\\Learn\\coder\\LayaProj\\Card\\laya\\assets';
var WRITE_PATH = 'E:\\Learn\\coder\\LayaProj\\Card\\laya\\assets\\';
// 后缀名
var SUFFIX = {
    // 配置
    CFG: {
        '.json': '.json '
    },
    // 资源
    RES: {
        '.jpg': '.jpg',
        '.png': '.png'
    },
    '3D': {
        '.png': '.png',
        '.ls': '.ls'
    },
    ATLAS: {
        '.atlas': '.atlas'
    }
};
// ============================= 变量
var layaFilesJson = {};
var timer;
// ============================= 方法
/**
 *
 * @param obj 判断对象
 * @param val 对照值
 */
var isInObject = function (obj, val) {
    for (var k in obj) {
        if (val.indexOf(k) >= 0) {
            return true;
        }
    }
    return false;
};
/**
 * 混合layajson
 * @param filePath 路径
 */
var mixLayaJson = function (filePath) {
    var splitArr, len, fileName, fileSuffix, res, assetsIdx, type;
    splitArr = filePath.split("\\");
    len = splitArr.length;
    if (!len)
        return;
    fileName = splitArr[len - 1];
    fileSuffix = fileName.substr(fileName.indexOf('.'));
    res = '';
    type = null;
    if (isInObject(SUFFIX.CFG, fileSuffix) && splitArr.indexOf('cfg') >= 0) {
        assetsIdx = splitArr.indexOf('assets');
        res = "" + splitArr.slice(assetsIdx + 1).join('/');
        type = EFile.JSON;
    }
    else if (isInObject(SUFFIX.RES, fileSuffix)) {
        // else if (isInObject(SUFFIX.RES, fileSuffix) && splitArr.indexOf('3d') < 0) {
        assetsIdx = splitArr.indexOf('assets');
        res = assetsIdx == len - 2 ? "res/" + fileName.split('.')[0] + ".atlas" :
            "res/" + splitArr.slice(assetsIdx + 1, len - 1).join('/') + ".atlas";
        type = EFile["2D"];
    }
    else if (isInObject(SUFFIX["3D"], fileSuffix) && splitArr.indexOf('3d') >= 0) {
        // TODO
    }
    else if (isInObject(SUFFIX.ATLAS, fileSuffix)) {
        assetsIdx = splitArr.indexOf('assets');
        res = "res/" + splitArr.slice(assetsIdx + 1).join('/');
        type = EFile["2D"];
    }
    if (res === '' || layaFilesJson[res])
        return;
    layaFilesJson[res] = { res: res, type: type };
    writeDataToFile(WRITE_PATH + "resconfig.json", layaFilesJson);
};
var readTargetFile = function (filePath) {
    fs_1.default.readdir(filePath, function (err, files) {
        if (err) {
            console.warn(err);
            return;
        }
        files.forEach(function (fileName) {
            var fileDir = path_1.default.join(filePath, fileName);
            fs_1.default.stat(fileDir, function (err, stats) {
                if (err) {
                    console.warn(err);
                    return;
                }
                if (stats.isFile()) {
                    // console.log(fileDir);
                    mixLayaJson(fileDir);
                }
                else if (stats.isDirectory()) {
                    readTargetFile(fileDir);
                }
            });
        });
    });
};
/**
 * 将数据写入文件
 * @param path
 * @param exportData
 */
var writeDataToFile = function (path, exportData) {
    timer && clearTimeout(timer);
    timer = setTimeout(function () {
        fs_1.default.writeFile(path, JSON.stringify(exportData), 'utf-8', function (err) {
            if (err) {
                console.log(err);
                return;
            }
            // exportData = null;
            console.log('success');
        });
    }, 500);
};
// ============================= 立即执行
readTargetFile(READ_PATH);
//# sourceMappingURL=main.js.map
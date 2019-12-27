"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ============================= 导入
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var jsonfile_1 = __importDefault(require("jsonfile"));
var types_1 = require("./types");
// ============================= 类型
// ============================= 常量
var Constants = /** @class */ (function () {
    function Constants() {
    }
    /**导出字符串 */
    Constants.EXPORT_STR = 'export default';
    /**3d文件夹 */
    Constants.FLODER_3D = '3d';
    /**配置文件夹 */
    Constants.FLODER_CFG = 'cfg';
    /**忽略后缀 */
    Constants.IGNORE_SUFFIX = [types_1.IgnoreSuffix.rec, types_1.IgnoreSuffix.ts];
    /**3D文件后缀名 */
    Constants.SUFFIX_3D = [
        types_1.Suffix3D.ls, types_1.Suffix3D.lh, types_1.Suffix3D.lm, types_1.Suffix3D.lmat, types_1.Suffix3D.lani,
        types_1.Suffix3D.jpg, types_1.Suffix3D.png, types_1.Suffix3D.ltc, types_1.Suffix3D.ktx, types_1.Suffix3D.pvr
    ];
    /**2D文件后缀名 */
    Constants.SUFFIX_2D = [types_1.Suffix2D.jpg, types_1.Suffix2D.png];
    /**配置后缀名 */
    Constants.SUFFIX_CFG = [types_1.SuffixCfg.json];
    return Constants;
}());
;
// ============================= 变量
/**构建配置 */
var buildCfg;
/**资源字符串 */
// let root: any = {};
var root = null;
/**写文件定时器id */
var timer;
// ============================= 方法
/**
 * 入口
 */
var entry = function () {
    // 初始化
    init();
    // 处理文件
    readTargetFile(buildCfg.resPath, handleRes);
};
/**
 * 初始化
 */
var init = function () {
    buildCfg = jsonfile_1.default.readFileSync('./buildcfg.json');
};
/**
 * 读取目标路径文件
 * @param filePath 文件路径
 * @param fileCB 操作文件回调
 */
var readTargetFile = function (filePath, fileCB) {
    // 读取文件夹
    fs_1.default.readdir(filePath, function (err, files) {
        if (err) {
            console.warn(" err: " + err);
            return;
        }
        files.forEach(function (fileName) {
            var fileDir = path_1.default.join(filePath, fileName);
            fs_1.default.stat(fileDir, function (err, stats) {
                if (err) {
                    console.warn(" err: " + err);
                    return;
                }
                if (stats.isFile()) {
                    fileCB && fileCB(fileDir.replace(/\\/g, '/'));
                }
                else if (stats.isDirectory()) {
                    readTargetFile(fileDir, fileCB);
                }
            });
        });
    });
};
/**
 * 处理资源
 * @param fileDir 文件全路径
 */
var handleRes = function (fileDir) {
    var cutDir = fileDir.substr((buildCfg.resPath + "/").length);
    var suffix = cutDir.substr(cutDir.lastIndexOf('.') + 1);
    var resPath = '';
    var loadType = types_1.LoadType.LOAD;
    // // 忽略文件
    // if (Constants.IGNORE_SUFFIX.includes(suffix)) {
    // }
    // 3d文件
    if (cutDir.includes(Constants.FLODER_3D + "/") && Constants.SUFFIX_3D.includes(suffix)) {
        resPath = cutDir;
        loadType = types_1.LoadType.CREATE;
    }
    // 配置文件
    else if (cutDir.includes(Constants.FLODER_CFG + "/") && Constants.SUFFIX_CFG.includes(suffix)) {
        resPath = cutDir;
        loadType = types_1.LoadType.LOAD;
    }
    // 2d文件
    else if (Constants.SUFFIX_2D.includes(suffix)) {
        var lastIdx = cutDir.lastIndexOf('/');
        if (lastIdx >= 0) {
            resPath = "res/atlas/" + cutDir.substr(0, lastIdx) + ".atlas";
        }
        else {
            var splitArr = cutDir.split('/');
            var fileName = splitArr[splitArr.length - 1];
            resPath = "res/" + fileName.split('.')[0] + ".atlas";
        }
        loadType = types_1.LoadType.LOAD;
    }
    // if (resPath === '' || root[resPath]) return;
    // root[resPath] = [type];
    // writeResConfig();
    if (resPath === '')
        return;
    PathToTree.pathToTree(resPath, loadType);
    writeResConfig();
};
/**
 * 根据字符串文件相对路径生成文件数结构
 */
var PathToTree = /** @class */ (function () {
    function PathToTree() {
    }
    PathToTree.getType = function (name, fileName) {
        if (name === fileName) {
            return 'document';
        }
        return 'folder';
    };
    PathToTree.pathToTree = function (path, loadType) {
        root = root || {
            n: '',
            u: '',
            t: 'f',
            lf: '',
            cn: []
        };
        PathToTree.addPath(root, path, loadType);
    };
    PathToTree.addPath = function (root, path, loadType) {
        var url = '';
        var pathArr = path.split('/');
        pathArr.forEach(function (name) {
            var flag = true;
            var children = root.cn;
            url = "" + url + (url ? '/' : '') + name;
            for (var i = 0; i < children.length; i++) {
                var node = children[i];
                if (node.n === name) {
                    root = node;
                    flag = false;
                    break;
                }
            }
            if (flag) {
                var type = PathToTree.getType(name, pathArr[pathArr.length - 1]);
                var newNode = {
                    n: name,
                    t: type === 'document' ? 'd' : 'f',
                    // u: url,
                    cn: []
                };
                if (type === 'document') {
                    // 加载类型
                    newNode.lf = loadType === types_1.LoadType.CREATE ? 'c' : 'l';
                }
                root.cn.push(newNode);
                root = newNode;
            }
        });
    };
    return PathToTree;
}());
/**
 * 写配置文件
 */
var writeResConfig = function () {
    timer && clearTimeout(timer);
    timer = setTimeout(function () {
        var resconfigStr = Constants.EXPORT_STR + " " + JSON.stringify(root);
        writeDataToFile(buildCfg.outputPath + "/" + buildCfg.fileName, resconfigStr, false);
    }, 500);
};
/**
 * 将数据写入文件
 * @param path
 * @param exportData
 */
var writeDataToFile = function (path, data, isStringify) {
    if (isStringify === void 0) { isStringify = true; }
    fs_1.default.writeFile(path, isStringify ? JSON.stringify(data) : data, 'utf-8', function (err) {
        if (err) {
            console.log(" err:: " + err);
            return;
        }
        console.log(" log:: build to [" + path + "] success");
    });
};
// ============================= 立即执行
entry();
//# sourceMappingURL=main.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 忽略后缀
 */
var IgnoreSuffix;
(function (IgnoreSuffix) {
    IgnoreSuffix["rec"] = "rec";
    IgnoreSuffix["ts"] = ".ts";
})(IgnoreSuffix = exports.IgnoreSuffix || (exports.IgnoreSuffix = {}));
;
/**
 * 3D文件后缀名
 */
var Suffix3D;
(function (Suffix3D) {
    /**场景文件 */
    Suffix3D["ls"] = "ls";
    /**预设文件 */
    Suffix3D["lh"] = "lh";
    /**模型数据文件 */
    Suffix3D["lm"] = "lm";
    /**材质数据文件 */
    Suffix3D["lmat"] = "lmat";
    /**动画数据文件 */
    Suffix3D["lani"] = "lani";
    /**蒙皮骨骼动画数据 */
    Suffix3D["lav"] = "lav";
    /**贴图文件 */
    Suffix3D["jpg"] = "jpg";
    Suffix3D["png"] = "png";
    Suffix3D["ltc"] = "ltc";
    Suffix3D["ktx"] = "ktx";
    Suffix3D["pvr"] = "pvr";
})(Suffix3D = exports.Suffix3D || (exports.Suffix3D = {}));
;
/**
 * 2D文件后缀名
 */
var Suffix2D;
(function (Suffix2D) {
    Suffix2D["jpg"] = "jpg";
    Suffix2D["png"] = "png";
    Suffix2D["atlas"] = "atlas";
})(Suffix2D = exports.Suffix2D || (exports.Suffix2D = {}));
;
/**
 * 配置文件后缀名
 */
var SuffixCfg;
(function (SuffixCfg) {
    SuffixCfg["json"] = "json";
})(SuffixCfg = exports.SuffixCfg || (exports.SuffixCfg = {}));
;
/**
 * 加载类型
 */
var LoadType;
(function (LoadType) {
    LoadType["LOAD"] = "load";
    LoadType["CREATE"] = "create";
})(LoadType = exports.LoadType || (exports.LoadType = {}));
;
;
/**字段映射 */
exports.FieldMap = {
    /**名称 */
    n: 'name',
    /**url */
    u: 'url',
    /**类型 */
    t: 'type',
    /**文件夹 */
    f: 'folder',
    /**文件 */
    d: 'document',
    /**加载方法 */
    lf: 'loadfn',
    /**create */
    c: 'create',
    /**load */
    l: 'load',
    /**子节点 */
    cn: 'children',
};
//# sourceMappingURL=types.js.map
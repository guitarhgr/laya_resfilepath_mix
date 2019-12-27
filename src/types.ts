/**
 * 构建配置
 */
export interface BuildCfg {
    /**
     * 资源路径
     */
    resPath: string;
    /**
     * 导出路径
     */
    outputPath: string;
    /**
     * 文件名
     */
    fileName: string;
}

/**
 * 忽略后缀
 */
export enum IgnoreSuffix {
    rec = 'rec',
    ts = '.ts',
};

/**
 * 3D文件后缀名
 */
export enum Suffix3D {
    /**场景文件 */
    ls = 'ls',
    /**预设文件 */
    lh = 'lh',
    /**模型数据文件 */
    lm = 'lm',
    /**材质数据文件 */
    lmat = 'lmat',
    /**动画数据文件 */
    lani = 'lani',
    /**蒙皮骨骼动画数据 */
    lav = 'lav',
    /**贴图文件 */
    jpg = 'jpg',
    png = 'png',
    ltc = 'ltc',
    ktx = 'ktx',
    pvr = 'pvr',
};

/**
 * 2D文件后缀名
 */
export enum Suffix2D {
    jpg = 'jpg',
    png = 'png',
    atlas = 'atlas',
};

/**
 * 配置文件后缀名
 */
export enum SuffixCfg {
    json = 'json',
};

/**
 * 加载类型
 */
export enum LoadType {
    LOAD = 'load',
    CREATE = 'create',
};

export type PathType = 'document' | 'folder';

export interface ResNode {
    /**
     * name 名称
     */
    n: string;
    /**
     * url
     */
    u?: string;
    /**
     * type 类型 f: 文件夹 d: 文件
     */
    t: string;
    /**
     * loadfn 加载方方法 c: create l: load
     */
    lf?: string;
    /**
     * 子节点
     */
    cn: ResNode[]
};

/**字段映射 */
export const FieldMap = {
    /**名称 */
    n : 'name',
    /**url */
    u : 'url',
    /**类型 */
    t : 'type',
    /**文件夹 */
    f : 'folder',
    /**文件 */
    d : 'document',
    /**加载方法 */
    lf: 'loadfn',
    /**create */
    c : 'create',
    /**load */
    l : 'load',
    /**子节点 */
    cn: 'children', 
};
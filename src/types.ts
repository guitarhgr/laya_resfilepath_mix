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

export enum FileType {
    '2d' = '2d',
    '3d' = '3d',
    'cfg' = 'cfg'
};
// ============================= 导入
import fs from 'fs';
import path from 'path';
import jsonFile from 'jsonfile';
import { BuildCfg, Suffix2D, Suffix3D, SuffixCfg, IgnoreSuffix, LoadType, PathType, ResNode } from './types';

// ============================= 类型


// ============================= 常量
class Constants {
    /**导出字符串 */
    static EXPORT_STR: string = 'export default';
    /**3d文件夹 */
    static FLODER_3D: string = '3d';
    /**配置文件夹 */
    static FLODER_CFG: string = 'cfg';
    /**忽略后缀 */
    static IGNORE_SUFFIX: IgnoreSuffix[] = [IgnoreSuffix.rec, IgnoreSuffix.ts];
    /**3D文件后缀名 */
    static SUFFIX_3D: Suffix3D[] = [
        Suffix3D.ls, Suffix3D.lh, Suffix3D.lm, Suffix3D.lmat, Suffix3D.lani,
        Suffix3D.jpg, Suffix3D.png, Suffix3D.ltc, Suffix3D.ktx, Suffix3D.pvr
    ];
    /**2D文件后缀名 */
    static SUFFIX_2D: Suffix2D[] = [Suffix2D.jpg, Suffix2D.png];
    /**配置后缀名 */
    static SUFFIX_CFG: SuffixCfg[] = [SuffixCfg.json];
};

// ============================= 变量
/**构建配置 */
let buildCfg: BuildCfg;
/**资源字符串 */
// let root: any = {};
let root: any = null;
/**写文件定时器id */
let timer: NodeJS.Timeout;

// ============================= 方法
/**
 * 入口
 */
const entry = () => {
    // 初始化
    init();

    // 处理文件
    readTargetFile(buildCfg.resPath, handleRes);
};

/**
 * 初始化
 */
const init = () => {
    buildCfg = jsonFile.readFileSync('./buildcfg.json');
};

/**
 * 读取目标路径文件
 * @param filePath 文件路径
 * @param fileCB 操作文件回调
 */
const readTargetFile = (filePath: string, fileCB?: Function) => {

    // 读取文件夹
    fs.readdir(filePath, (err: NodeJS.ErrnoException | null, files: string[]) => {
        if (err) {
            console.warn(` err: ${err}`);
            return;
        }

        files.forEach((fileName: string) => {
            const fileDir = path.join(filePath, fileName);

            fs.stat(fileDir, (err: NodeJS.ErrnoException | null, stats: fs.Stats) => {
                if (err) {
                    console.warn(` err: ${err}`);
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
const handleRes = (fileDir: string) => {
    const cutDir: string = fileDir.substr(`${buildCfg.resPath}/`.length);
    const suffix: any = cutDir.substr(cutDir.lastIndexOf('.')+1);
    let resPath: string = '';
    let loadType: LoadType = LoadType.LOAD; 

    // // 忽略文件
    // if (Constants.IGNORE_SUFFIX.includes(suffix)) {

    // }
    // 3d文件
    if (cutDir.includes(`${Constants.FLODER_3D}/`) && Constants.SUFFIX_3D.includes(suffix)) {
        resPath = cutDir;
        loadType = LoadType.CREATE;
    }
    // 配置文件
    else if (cutDir.includes(`${Constants.FLODER_CFG}/`) && Constants.SUFFIX_CFG.includes(suffix)) {
        resPath = cutDir;
        loadType = LoadType.LOAD;
    }
    // 2d文件
    else if (Constants.SUFFIX_2D.includes(suffix)) {
        const lastIdx = cutDir.lastIndexOf('/');

        if (lastIdx >= 0) {
            resPath = `res/atlas/${cutDir.substr(0, lastIdx)}.atlas`;
        } else {
            const splitArr: string[] = cutDir.split('/');
            const fileName = splitArr[splitArr.length-1];

            resPath = `res/${fileName.split('.')[0]}.atlas`;
        }

        loadType = LoadType.LOAD;
    }

    // if (resPath === '' || root[resPath]) return;
    
    // root[resPath] = [type];
    
    // writeResConfig();
    
    if (resPath === '') return;

    PathToTree.pathToTree(resPath, loadType);
    writeResConfig();
};

/**
 * 根据字符串文件相对路径生成文件数结构
 */
class PathToTree {
    public static getType = (name: string, fileName: string): PathType => {
        if (name === fileName) {
            return 'document';
        }

        return 'folder';
    };

    public static pathToTree = (path: string, loadType: LoadType) => {
        root = root || {
            n: '',
            u: '',
            t: 'f',
            lf: '',
            cn: []
        }

        PathToTree.addPath(root, path, loadType);
    };

    public static addPath = (root: any, path: string, loadType: LoadType) => {
        let url: string = '';
        let pathArr: string[] = path.split('/');

        pathArr.forEach((name: string) => {
            let flag: boolean = true;
            let children: ResNode[] = root.cn;

            url = `${url}${url ? '/' : ''}${name}`;

            for (let i = 0; i < children.length; i++) {
                const node:ResNode = children[i];

                if (node.n === name) {
                    root = node;
                    flag = false;
                    break;
                }
            }

            if (flag) {
                const type: PathType = PathToTree.getType(name, pathArr[pathArr.length-1]);
                const newNode: ResNode = {
                    n: name,
                    t: type === 'document' ? 'd' : 'f',
                    // u: url,
                    cn: []
                };

                if (type === 'document') {
                    // 加载类型
                    newNode.lf = loadType === LoadType.CREATE ? 'c' : 'l';
                }

                root.cn.push(newNode);

                root = newNode;
            }
        });

    };
}


/**
 * 写配置文件
 */
const writeResConfig = () => {
    timer && clearTimeout(timer);

    timer = setTimeout(() => {
        const resconfigStr = `${Constants.EXPORT_STR} ${JSON.stringify(root)}`;

        writeDataToFile(`${buildCfg.outputPath}/${buildCfg.fileName}`, resconfigStr, false);
    }, 500);
};

/**
 * 将数据写入文件
 * @param path 
 * @param exportData 
 */
const writeDataToFile = (path: string, data: any, isStringify = true) => {
    
    fs.writeFile(path, isStringify ? JSON.stringify(data) : data, 'utf-8', (err: NodeJS.ErrnoException | null) => {
        if (err) {
            console.log(` err:: ${err}`);
            return;
        }
        
        console.log(` log:: build to [${path}] success`);
    });
};

// ============================= 立即执行
entry();
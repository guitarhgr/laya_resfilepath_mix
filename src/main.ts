import fs from "fs";
import path from 'path';

// ============================= 导入

// ============================= 类型
enum EFile {
    '2D'   = '2d',
    '3D'   = '3d',
    'JSON' = 'json'
}

// ============================= 常量
const READ_PATH = 'E:\\Learn\\coder\\LayaProj\\Card\\laya\\assets';
const WRITE_PATH = 'E:\\Learn\\coder\\LayaProj\\Card\\laya\\assets\\';

// 后缀名
const SUFFIX = {
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
let layaFilesJson:any = {};
let timer: NodeJS.Timeout;

// ============================= 方法
/**
 * 
 * @param obj 判断对象
 * @param val 对照值
 */
const isInObject = (obj: Object, val: string) => {
    for (let k in obj) {
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
const mixLayaJson = (filePath: string) => {
    let splitArr: string[], len: number, fileName: string, fileSuffix: string, res: string, assetsIdx: number, type: EFile | null;

    splitArr = filePath.split("\\");
    len = splitArr.length;
    
    if (!len) return;

    fileName = splitArr[len-1];
    fileSuffix = fileName.substr(fileName.indexOf('.'));
    res = '';
    type = null;
    

    if (isInObject(SUFFIX.CFG, fileSuffix) && splitArr.indexOf('cfg') >= 0) {
        assetsIdx = splitArr.indexOf('assets');
        res = `${splitArr.slice(assetsIdx+1).join('/')}`;
        type = EFile.JSON
    }
    else if (isInObject(SUFFIX.RES, fileSuffix)) {
    // else if (isInObject(SUFFIX.RES, fileSuffix) && splitArr.indexOf('3d') < 0) {
        assetsIdx = splitArr.indexOf('assets');

        res = assetsIdx == len - 2 ? `res/${fileName.split('.')[0]}.atlas` :
                                     `res/${splitArr.slice(assetsIdx+1, len-1).join('/')}.atlas`;
        type = EFile["2D"];
    }
    else if (isInObject(SUFFIX["3D"], fileSuffix) && splitArr.indexOf('3d') >= 0) {
        // TODO
    }
    else if (isInObject(SUFFIX.ATLAS, fileSuffix)) {
        assetsIdx = splitArr.indexOf('assets');

        res = `res/${splitArr.slice(assetsIdx+1).join('/')}`;
        type = EFile["2D"];
    }

    if (res === '' || layaFilesJson[res]) return;

    layaFilesJson[res] = { res, type };
    
    writeDataToFile(`${WRITE_PATH}resconfig.json`, layaFilesJson);
};

const readTargetFile = (filePath: string) => {

    fs.readdir(filePath, (err: NodeJS.ErrnoException | null, files: string[]) => {
        if (err) {
            console.warn(err);
            return;
        }

        files.forEach((fileName: string) => {
            const fileDir = path.join(filePath, fileName);

            fs.stat(fileDir, (err: NodeJS.ErrnoException | null, stats: fs.Stats) => {
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
const writeDataToFile = (path: string, exportData: any) => {
    timer && clearTimeout(timer);

    timer = setTimeout(() => {
        fs.writeFile(path, JSON.stringify(exportData), 'utf-8', (err: NodeJS.ErrnoException | null) => {
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
import fs from "fs";
import path from 'path';

// ============================= 导入

// ============================= 类型

// ============================= 常量
const READ_PATH = 'E:\\XiaoXi\\coder\\LayaProj\\Card\\laya\\assets';

// 后缀名
const SUFFIX = {
    // 配置
    CFG: {
        '.cfg': '.cfg'
    },
    // 资源
    RES: {
        '.jpg': '.jpg',
        '.png': '.png' 
    }
};

// const WRITE_PATH = 'E:\\Learn\\coder\\CocosProj\\FoodEscape\\assets\\resources\\cfg\\';

// ============================= 变量
let layaFilesJson = {};

// ============================= 方法
const isInObject = (obj: Object, val: string) => {
    for (let k in obj) {
        if (val.indexOf(k) >= 0) {
            return true;
        }
    }

    return false;
};

const mixLayaJson = (filePath: string) => {
    let splitArr: string[], len: number, fileName: string, fileSuffix: string, layaPath: string;

    splitArr = filePath.split("\\");
    len = splitArr.length;
    
    if (!len) return;

    fileName = splitArr[len-1];
    fileSuffix = fileName.substr(fileName.indexOf('.'));

    if (isInObject(SUFFIX.CFG, fileSuffix)) {
        console.log('cfg');
    }
    else if (isInObject(SUFFIX.RES, fileSuffix)) {

        // layaPath = len < 2 ? `res/`
    }

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
                    console.log(fileDir);
                    mixLayaJson(fileDir);
                }
                else if (stats.isDirectory()) {
                    readTargetFile(fileDir);
                }
            });
        });
    });
};

// ============================= 立即执行

readTargetFile(READ_PATH);
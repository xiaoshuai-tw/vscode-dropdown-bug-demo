/**
 * 将message中的对象合并到json中，并返回json
 * @param json 
 * @param message 
 */
export function mergeJSON(json: any, message: any) {
    for (var key in message) {
        if (json[key] === undefined) {  // 不冲突的，直接赋值
            json[key] = message[key];
            continue;
        }
        if (typeof message[key] !== "object") { // 存在冲突的，如果不是object则赋值
            json[key] = message[key];
            continue;
        }
        if (typeof message[key] === "object" && message[key].constructor === Array) { //存在冲突且是array的，则直接赋值（当前适用）
            json[key] = message[key];
            continue;
        }
        if (typeof message[key] === "object" && message[key].constructor === Object) { //存在冲突且是object的，则继续递归遍历
            mergeJSON(json[key], message[key])
        }

    }
    return json;
}

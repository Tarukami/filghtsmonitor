import path from "path";
import { readFileSync, writeFileSync, type PathLike, openSync } from "fs";

const dataDir = path.resolve("./src/data");
const getPathTo = (filename: string) => path.join(dataDir, filename);

const readJSONFile = <T>(path: PathLike): T => {
  try {
    const contentAsString = readFileSync(path, { encoding: "utf-8", flag: "a+" });
    if (contentAsString.length === 0) return;
    return JSON.parse(contentAsString);
  } catch (e) {
    throw new Error("Could not read JSON file");
  }
};

type DataToJSON = string | Record<any, any> | any[];
const writeJSONFile = (path: PathLike, data: DataToJSON) => {
  try {
    writeFileSync(path, JSON.stringify(data, null, 2), { encoding: "utf-8", flag: "w+" });
  } catch (e) {
    throw new Error("Could not write JSON file");
  }
};

export { getPathTo, readJSONFile, writeJSONFile };

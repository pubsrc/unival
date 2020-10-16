/**
 * @author Bilal Syed
 * @email syedbilal228@gmail.com
 * @create date 2020-09-20
 * @modify date 2020-09-20
 * @desc Contains configurations of the extension
 */
import * as fs from 'fs';
import * as path from 'path';
import Config from './entities/Config';
import WhitelistItem from './entities/WhitelistItem';
import TestBy from './TestBy';
import LogUtil from './LogUtil';
export default class ConfigManager {
  public config: Config;
  private static instance: ConfigManager;

  private constructor() {
    let configFileFullName = path.resolve('./unival.json');
    if (process && process.argv && process.argv.length > 0) {
      const configArgument = process.argv.find(arg => arg.startsWith('--config='));
      if (configArgument) {
        const parthInArgument = configArgument.substring(9);
        configFileFullName = path.resolve(parthInArgument);
      }
    }

    let configFromSource = this.loadConfigFromFile(configFileFullName);
    if (!configFromSource) {
      LogUtil.log('Config not initilaized from file.');
      LogUtil.log('Using default configurations');
      this.config = new Config();
    } else {
      this.config = configFromSource;
    }
    this.init();
  }

  private init() {
    const root: string = path.resolve('./');
    if (this.config.src && this.config.src.size > 0) {
      let srcArray = Array.from(this.config.src);
      srcArray = srcArray.map(p => path.join(root, p));
      const absolutePaths = this.convertRelativePathsToAbosolute(srcArray, root);
      this.config.src = new Set<string>(absolutePaths);
    }

    this.resoloveWhitelistSrc(this.config.whitelist, root);
    const groups: string[][] = this.convertFileGroupRelativePathsToAbosolute(root);
    this.config.groups = groups;
  }

  private resoloveWhitelistSrc(whitelist: WhitelistItem[], root: string) {
    if (whitelist && whitelist.length > 0) {
      whitelist.forEach(whitelistItem => {
        if (whitelistItem && whitelistItem.src && whitelistItem.src.length > 0) {
          let absoluteSrcList: string[] = [];
          whitelistItem.src.forEach(src => {
            src = path.resolve(src);
            if (fs.existsSync(src)) {
              const isDirectory = fs.lstatSync(src).isDirectory();
              if (isDirectory) {
                absoluteSrcList = this.getAllFilesFromPath(src);
              } else {
                absoluteSrcList.push(src);
              }
            }
          });
          absoluteSrcList = absoluteSrcList.filter(ap => this.config.src.has(ap));
          whitelistItem.src = absoluteSrcList;
        }
      });
    }
  }
  private loadConfigFromFile(path: string): Config | null {
    if (fs.existsSync(path)) {
      try {
        const jsonStr = fs.readFileSync(path, 'utf-8');
        const json = JSON.parse(jsonStr);

        if (json.src && json.src.length > 0) {
          json.src = new Set(json.src);
        }
        if (json && json.whitelist && json.whitelist.length > 0) {
          const whitelist = this.whitelistArraysToSets(json.whitelist, json.caseSensitive);
          json.whitelist = whitelist;
        }
        const config: Config = json;
        return config;
      } catch (e) {
        console.log(e);
      }
    } else {
      LogUtil.log(`Config (unival.json) not found at ${path}`);
    }
    return null;
  }
  private whitelistArraysToSets(whitelistJsonArray: [any], caseSensitive: boolean): WhitelistItem[] {
    let whitelist: WhitelistItem[] = [];
    if (whitelistJsonArray && whitelistJsonArray.length > 0) {
      whitelist = whitelistJsonArray.map(whitelisteItemJson => {
        const whitelistItem = new WhitelistItem();
        whitelistItem.src = whitelisteItemJson.src;

        if (whitelisteItemJson.keySet) {
          whitelistItem.keySet = this.convertArrayToSet(whitelisteItemJson.keySet, caseSensitive);
        }
        if (whitelisteItemJson.valueSet) {
          whitelistItem.valueSet = this.convertArrayToSet(whitelisteItemJson.valueSet, caseSensitive);
        }
        return whitelistItem;
      });
    }
    return whitelist;
  }

  private convertArrayToSet(array: string[], caseSensitive: boolean): Set<string> {

    if (!caseSensitive) {
      array = array.map((v: string) => v.toLowerCase().trim());
    }
    const set = new Set(array);
    return set;
  }

  private convertFileGroupRelativePathsToAbosolute(root: string) {
    const groups: string[][] = [];
    if (this.config.groups && this.config.groups.length > 0) {
      this.config.groups.forEach(group => {
        if (group && group.length > 0) {
          let absolutePaths = this.convertRelativePathsToAbosolute(group, root);
          absolutePaths = absolutePaths.filter(ap => this.config.src.has(ap));
          if (absolutePaths && absolutePaths.length > 0) {
            groups.push(absolutePaths);
          }
        }
      });
    }
    return groups;
  }

  private convertRelativePathsToAbosolute(paths: string[], root: string): string[] {
    let absolutePaths: string[] = [];
    paths.forEach(relativePath => {
      if (relativePath && relativePath.trim()) {
        relativePath = path.resolve(relativePath);
        // if (!relativePath.includes(root)) {
        //   relativePath = path.join(root, relativePath.trim());
        // }
        if (fs.existsSync(relativePath)) {
          const isDirectory = fs.lstatSync(relativePath).isDirectory();
          if (isDirectory) {
            absolutePaths = this.getAllFilesFromPath(relativePath);
          } else {
            const isTarget = this.isTargetExtension(relativePath);
            if (isTarget) {
              absolutePaths.push(relativePath);
            }
          }
        }
      }
    });
    return absolutePaths;
  }

  private getAllFilesFromPath(directoryPath: string): string[] {
    const fileGroup: string[] = [];
    this.getAllFilesFromDirectoryAndSubDirectories(directoryPath, fileGroup);
    return fileGroup;
  }
  private getAllFilesFromDirectoryAndSubDirectories(dirPath: string, arrayOfFiles: string[]) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = this.getAllFilesFromDirectoryAndSubDirectories(fullPath, arrayOfFiles);
      } else {
        const isTarget = this.isTargetExtension(fullPath);
        if (isTarget) {
          arrayOfFiles.push(fullPath);
        }
      }
    });
    return arrayOfFiles;
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }
  
  public isTargetExtension(fileName: string) {
    const validateAll = this.config.target.includes('.*');
    if (validateAll) {
      return true;
    }
    const extension = path.extname(fileName);
    return this.config.target.includes(extension);
  }
  public isLineToSkip(line: string): boolean {
    if (!line || line === "\n" || line === "\r") { return true; }

    let isToSkip = false;
    if (this.config.skipLinePrefix && this.config.skipLinePrefix.length > 0) {
      for (let i = 0; i < this.config.skipLinePrefix.length; i++) {
        const skipWord = this.config.skipLinePrefix[i];
        if (line.startsWith(skipWord)) {
          isToSkip = true;
          break;
        }
      }
    }
    return isToSkip;
  }
  public isFileInSrc(file: string): boolean {
    return this.config.src.has(file);
  }
  public isWhitelisted(testBy: string, value: string, file: string): boolean {
    let isWhitelisted = false;
    if (this.config.whitelist && this.config.whitelist.length > 0) {
      file = file.toLocaleLowerCase();
      const whitelist = this.config.whitelist.find(whitelist => whitelist.src && whitelist.src.some(f => f.toLowerCase() === file));
      if (whitelist) {
        switch (testBy) {
          case TestBy.KEY:
            isWhitelisted = whitelist.keySet && whitelist.keySet.has(value);
            break;
          case TestBy.VALUE:
          case TestBy.KEYVALUE:
          case TestBy.LINE:
            isWhitelisted = whitelist.valueSet && whitelist.valueSet.has(value);
            break;
        }
      }
    }
    return isWhitelisted;
  }
}
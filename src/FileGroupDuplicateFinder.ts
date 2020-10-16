/**
 * @author Bilal Syed
 * @email syedbilal228@gmail.com
 * @create date 2020-10-10
 * @modify date 2020-10-10
 * @desc Finds duplicate in file groups
 */
import ConfigManager from './ConfigManager';
import Config from './entities/Config';
import FileGroupsDuplicacyValidator from './validators/FileGroupsDuplicacyValidator';
import FileGroupItemizer from './FileGroupItemizer';
import TestBy from './TestBy';
import LogUtil from './LogUtil';
export default class FileGroupDuplicateFinder {
  private config: Config;
  private fileGroupsDuplicacyValidator: FileGroupsDuplicacyValidator;
  private fileGroupItemizer: FileGroupItemizer;

  constructor() {
    const configManager = ConfigManager.getInstance();
    this.config = configManager.config
    this.fileGroupItemizer = new FileGroupItemizer();
    this.fileGroupsDuplicacyValidator = new FileGroupsDuplicacyValidator(configManager);
  }
  private printGroupDuplicates(duplicateItemMap: Map<string, Map<string, Map<string, number>>>, testBy: string[]) {
    if (testBy && testBy.length > 0) {
      testBy.forEach(testKey => {
        const refrenceMap: Map<string, Map<string, number>> | undefined = duplicateItemMap.get(testKey);
        if (refrenceMap) {
          refrenceMap.forEach((fileMap, key) => {
            LogUtil.error(`${key} is found in below files`);
            fileMap.forEach((lineNumber, fileName) => {
              LogUtil.log(`  Duplicate ${testKey} in ${fileName} line ${lineNumber + 1}`);
            });
          });
        }
      });

    }
  }

  private removeNonDuplicateFileMaps(duplicateFileMap: Map<string, Map<string, number>> | undefined) {
    if (duplicateFileMap && duplicateFileMap.size > 0) {
      duplicateFileMap?.forEach((keyFileMap, key) => {
        if (keyFileMap && keyFileMap.size < 2) {
          duplicateFileMap.delete(key);
        }
      })
    }
  }
  public findDuplicatesInGroups(): number {
    let duplicateCount = 0;
    if (this.config.groups && this.config.groups.length > 0) {
      this.config.groups.forEach( group => {

        const fileGroupDistinctItemsList = this.fileGroupItemizer.itemizeFileGroup(group, [this.config.testBy], this.config.delimiter, this.config.encoding);
        const duplicateItemMap = this.fileGroupsDuplicacyValidator.getGroupDuplicateItemeMap(fileGroupDistinctItemsList, this.config.testBy);
        const testByKeys = this.config.testBy == TestBy.KEYVALUE ? [TestBy.KEY, TestBy.VALUE] : [this.config.testBy];

        if (duplicateItemMap.has(TestBy.KEY) || duplicateItemMap.has(TestBy.KEYVALUE)) {
          this.removeNonDuplicateFileMaps(duplicateItemMap.get(TestBy.KEY));
          duplicateCount += duplicateItemMap.get(TestBy.KEY)?.size || 0;
        }
        if (duplicateItemMap.has(TestBy.VALUE) || duplicateItemMap.has(TestBy.KEYVALUE)) {
          this.removeNonDuplicateFileMaps(duplicateItemMap.get(TestBy.VALUE));
          duplicateCount += duplicateItemMap.get(TestBy.VALUE)?.size || 0;
        }
        if (duplicateItemMap.has(TestBy.LINE)) {
          this.removeNonDuplicateFileMaps(duplicateItemMap.get(TestBy.LINE));
          duplicateCount += duplicateItemMap.get(TestBy.LINE)?.size || 0;
        }
        this.printGroupDuplicates(duplicateItemMap, testByKeys);
      });
    }
    return duplicateCount;
  }
}

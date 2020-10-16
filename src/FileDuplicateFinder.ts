import fs from 'fs';
import ConfigManager from './ConfigManager';
import Config from './entities/Config';
import DuplicateItem from './entities/DuplicateItem';
import FileDuplicacyValidator from './validators/FileDuplicacyValidator';
import LogUtil from './LogUtil';

export default class FileDuplicateFinder {
  private config: Config;
  private duplicacyValidator: FileDuplicacyValidator;
  constructor() {
    this.config = ConfigManager.getInstance().config;
    this.duplicacyValidator = new FileDuplicacyValidator(this.config);
  }
  private printFileDuplicates(duplicateItems: DuplicateItem[], fileName: string) {
    if (duplicateItems && duplicateItems.length > 0) {
      if (fileName) {
        LogUtil.log(`${fileName} (${duplicateItems.length} duplicates)`);
      }
      duplicateItems.forEach(duplicateItem => {
        LogUtil.error(`  Line ${duplicateItem.lineNumber + 1}: Duplicate ${duplicateItem.testBy} (${duplicateItem.duplicate}) of line ${duplicateItem.orignalLineNumber + 1}`);
      });
    }
  }

  public findDuplicatesInFiles(): number {
    let duplicateCount = 0;
    if (this.config.src && this.config.src.size > 0) {
      this.config.src.forEach(fileName => {
        let text = fs.readFileSync(fileName, this.config.encoding);
        if (text) {
          if (!this.config.caseSensitive) {
            text = text.toLowerCase();
          }
          const lines = text.split("\n");
          let fileDuplicates = this.duplicacyValidator.findDuplicatesFromLines(lines, fileName, this.config.testBy);
          fileDuplicates = fileDuplicates.filter(duplicateItem => !duplicateItem.isWhiteListed);
          this.printFileDuplicates(fileDuplicates, fileName);
          duplicateCount += fileDuplicates.length;
        }
      });
    }
    return duplicateCount;
  }
}

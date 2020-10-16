import ConfigManager from "./ConfigManager";
import FileGroupDistinctItems from "./entities/FileGroupDistinctItems";
/**
 * @author Bilal Syed
 * @email syedbilal228@gmail.com
 * @create date 2020-09-20
 * @modify date 2020-09-20
 * @desc Finds distinct key,value, keyvalue or lines in a file
 */

import TestBy from "./TestBy";

export default class DistinctItemFinder {
  private configManager: ConfigManager;

  constructor() {
    this.configManager = ConfigManager.getInstance();
  }

  private getItemBasedOnKey(line: string, delimiter: string, testBy: string): string | undefined {
    const tokens = line.split(delimiter);
    let value = undefined;
    switch (testBy) {
      case TestBy.KEY:
        if (tokens.length > 0) {
          value = tokens[0]?.trim();
        }
        break;
      case TestBy.VALUE:
        if (tokens.length > 1) {
          value = tokens[1]?.trim();
        }
        break;
      case TestBy.LINE:
        value = line;
        break;
    }
    return value;
  }

  private fillMapWithDistinctItems(distinctItemsMap: Map<string, number>, lines: string[], delimiter: string, testBy: string): Map<string, number> {
    for (let i = 0; lines && i < lines.length; i++) {
      const line = lines[i];
      const isLineToValidate = !this.configManager.isLineToSkip(line);
      if (isLineToValidate) {
        const item = this.getItemBasedOnKey(line, delimiter, testBy);
        if (item !== undefined) {
          if (!distinctItemsMap.has(item)) {
            distinctItemsMap.set(item, i);
          }
        }
      }
    }
    return distinctItemsMap;
  }

  public getDisctinctFileItems(lines: string[], testBy: string[], delimiter: string): FileGroupDistinctItems {
    const fileGroupDistinctItems: FileGroupDistinctItems = new FileGroupDistinctItems();
    if (testBy && testBy.length > 0) {
      testBy.forEach(test => {
        switch (test) {
          case TestBy.KEY:
            this.fillMapWithDistinctItems(fileGroupDistinctItems.keyMap, lines, delimiter, test);
            break;
          case TestBy.VALUE:
            this.fillMapWithDistinctItems(fileGroupDistinctItems.valueMap, lines, delimiter, test);
            break;
          case TestBy.KEYVALUE:
            this.fillMapWithDistinctItems(fileGroupDistinctItems.keyMap, lines, delimiter, TestBy.KEY);
            this.fillMapWithDistinctItems(fileGroupDistinctItems.valueMap, lines, delimiter, TestBy.VALUE);
            break;
          case TestBy.LINE:
            this.fillMapWithDistinctItems(fileGroupDistinctItems.lineMap, lines, delimiter, test);
            break;
        }
      });
    }
    return fileGroupDistinctItems;
  }

}
import ConfigManager from "../ConfigManager";
/**
 * @author Bilal Syed
 * @email syedbilal228@gmail.com
 * @create date 2020-09-20
 * @modify date 2020-09-20
 * @desc Finds duplicate items(key, value, keyvalue or enire line) in given lines.
 */
import Config from "../entities/Config";
import DuplicateItem from "../entities/DuplicateItem";
import TestBy from "../TestBy";

export default class FileDuplicacyValidator {
  private config: Config;
  private configManager: ConfigManager;

  constructor(config: Config) {
    this.config = config;
    this.configManager = ConfigManager.getInstance();
  }

  private getValuesBasedOnTestBy(line: string, testBy: string): string[] {
    const tokensToVerify: string[] = [];
    const tokens = line.split(this.config.delimiter);
    switch (testBy) {
      case TestBy.KEY:
        if (tokens.length > 0) {
          tokensToVerify.push(tokens[0]);
        }
        break;
      case TestBy.VALUE:
        if (tokens.length > 1) {
          tokensToVerify.push(tokens[1]);
        }
        break;
      case TestBy.KEYVALUE:
        if (tokens.length > 0) {
          tokensToVerify.push(tokens[0]);
        }
        if (tokens.length > 1) {
          tokensToVerify.push(tokens[1]);
        }
        break;
      case TestBy.LINE:
        if (line) {
          tokensToVerify.push(line);
        }
    }
    return tokensToVerify;
  }

  private getDuplicate(testBy: string, line: string, filName: string, keyName: string, key: string, originalLineNumber: number | undefined, lineNumber: number) {
    const originalLine = originalLineNumber || 0;
    const isWhitelisted = this.configManager.isWhitelisted(testBy, key, filName);
    const duplicateItem = new DuplicateItem(filName, originalLine, lineNumber, key, keyName, isWhitelisted);
    return duplicateItem;
  }

  public findDuplicatesFromLines(lines: string[], filName: string, testBy: string): DuplicateItem[] {
    const keyMap: Map<string, number> = new Map<string, number>();
    const valueMap: Map<string, number> = new Map<string, number>();
    const duplicateItems: DuplicateItem[] = [];
    for (let lineNumber = 0; lines && lineNumber < lines.length; lineNumber++) {
      const line = lines[lineNumber]?.trim();
      const isLineToValidate = !this.configManager.isLineToSkip(line);
      if (isLineToValidate) {
        const values: string[] = this.getValuesBasedOnTestBy(line, testBy);
        const isKeyOrValueToBeValidated = values && values.length > 0 && values[0];
        const isKeyAndValueToBeValidated = values && values.length > 1 && values[0] && values[1];
        let duplicateItem: DuplicateItem | null = null;

        const key = isKeyOrValueToBeValidated ? values[0].trim() : undefined;
        const value = isKeyAndValueToBeValidated ? values[1].trim() : undefined;

        if (key) {
          if (keyMap.has(key)) {
            duplicateItem = this.getDuplicate(testBy, line, filName, TestBy.KEY, key, keyMap.get(key), lineNumber);
            duplicateItems.push(duplicateItem);
          } else {
            keyMap.set(key, lineNumber);
          }
        }
        if (value) {
          if (valueMap.has(value)) {
            duplicateItem = this.getDuplicate(testBy, line, filName, TestBy.VALUE, value, valueMap.get(value), lineNumber);
            duplicateItems.push(duplicateItem);
          } else {
            valueMap.set(value, lineNumber);
          }
        }
      }
    }
    return duplicateItems;
  }
}

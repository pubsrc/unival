/**
 * @author Bilal Syed
 * @email syedbilal228@gmail.com
 * @create date 2020-09-20
 * @modify date 2020-09-20
 * @desc Reads a files in a all the file groups returns map of 0 based group number as key and value is a 
 * map of file name as key and line as value
 */

import * as fs from 'fs';
import ConfigManager from './ConfigManager';
import DistinctItemFinder from './DistinctItemFinder';
import Config from './entities/Config';
import FileGroupDistinctItems from './entities/FileGroupDistinctItems';

export default class FileGroupItemizer {
  private distinctItemFinder: DistinctItemFinder;
  private config: Config;
  constructor() {
    this.distinctItemFinder = new DistinctItemFinder();
    this.config = ConfigManager.getInstance().config;
  }
  public itemizeFileGroup(fileGroup: string[], testBy: string[], delimiter: string, encoding: BufferEncoding): FileGroupDistinctItems[] {
    const fileGroupDistinctItemsList: FileGroupDistinctItems[] = [];
    if (fileGroup && fileGroup.length > 0) {
      fileGroup.forEach(async fileName => {
        let text = fs.readFileSync(fileName, encoding);

        if (text) {
          if (!this.config.caseSensitive) {
            text = text.toLowerCase();
          }
          const lines = text.split('\n');
          if (lines && lines.length > 0) {
            const fileGroupDistinctItems = this.getDistinctFileItems(lines, testBy, delimiter);
            fileGroupDistinctItems.fileName = fileName;
            fileGroupDistinctItemsList.push(fileGroupDistinctItems);
          }
        }
      });
    }
    return fileGroupDistinctItemsList;
  }

  private getDistinctFileItems(lines: string[], testBy: string[], delimiter: string): FileGroupDistinctItems {
    let fileGroupDistinctItems: FileGroupDistinctItems = new FileGroupDistinctItems();
    if (lines && lines.length > 0) {
      fileGroupDistinctItems = this.distinctItemFinder.getDisctinctFileItems(lines, testBy, delimiter);
    }
    return fileGroupDistinctItems;
  }
}
/**
 * @author Bilal Syed
 * @email syedbilal228@gmail.com
 * @create date 2020-09-20
 * @modify date 2020-09-20
 * @desc represents a duplicate item (key, value, keyvalue or line)
 */
export default class DuplicateItem {
  public fileName: string;
  public orignalLineNumber: number;
  public lineNumber: number;
  public duplicate: string;
  public testBy: string;
  public isWhiteListed: boolean;
  public sourceLineNumber: number | undefined;
  constructor(
    fileName: string,
    orignalLineNumber: number,
    lineNumber: number,
    duplicate: string,
    testBy: string,
    isWhitelisted: boolean) {

    this.fileName = fileName;
    this.orignalLineNumber = orignalLineNumber;
    this.lineNumber = lineNumber;
    this.duplicate = duplicate;
    this.testBy = testBy;
    this.isWhiteListed = isWhitelisted;
  }
}
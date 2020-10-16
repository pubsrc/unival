/**
 * @author Bilal Syed
 * @email syedbilal228@gmail.com
 * @create date 2020-09-30
 * @modify date 2020-09-30
 * @desc A whitelist item
 */

export default class WhitelistItem {
  public src: string[] = [];
  public keySet: Set<string>;
  public valueSet: Set<string>;

  constructor() {
    this.keySet = new Set();
    this.valueSet = new Set();
  }
}

/**
 * @author Bilal Syed
 * @email syedbilal228@gmail.com
 * @create date 2020-10-03
 * @modify date 2020-10-03
 * @desc Config
 */
import TestBy from "../TestBy";
import WhitelistItem from "./WhitelistItem";

export default class Config {
  public target: string[] = ['.properties'];
  public src: Set<string>;
  public delimiter = '=';
  public testBy = TestBy.KEYVALUE;
  public groups: string[][] = [];
  public encoding: BufferEncoding = 'utf-8';
  public skipLinePrefix: string[] = ['#']
  public whitelist: WhitelistItem[] = [];
  public caseSensitive = false;

  constructor() {
    this.src = new Set<string>();
  }
}
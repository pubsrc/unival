/**
 * @author Bilal Syed
 * @email syedbilal228@gmail.com
 * @create date 2020-09-20
 * @modify date 2020-09-20
 * @desc eads a file finds duplicates and stores key/value/keyvalue/lines in a set to be
 * compared with other files in the same file group
 */

import KeyValueMap from './KeyValueMap';
export default class FileGroupDistinctItems {
	private _keyMap: Map<string, number>;
	private _valueMap: Map<string, number>;
	private _keyValueMap: KeyValueMap;
	private _lineMap: Map<string, number>;
	private _fileName: string;

	public get keyMap(): Map<string, number> {
		return this._keyMap;
	}
	public set keyMap(v: Map<string, number>) {
		this._keyMap = v;
	}

	public get valueMap(): Map<string, number> {
		return this._valueMap;
	}
	public set valueMap(v: Map<string, number>) {
		this._valueMap = v;
	}

	public get keyValueMap(): KeyValueMap {
		return this._keyValueMap;
	}
	public set keyValueMap(v: KeyValueMap) {
		this._keyValueMap = v;
	}

	public get lineMap(): Map<string, number> {
		return this._lineMap;
	}
	public set lineMap(v: Map<string, number>) {
		this._lineMap = v;
	}
	public get fileName(): string {
		return this._fileName;
	}
	public set fileName(v: string) {
		this._fileName = v;
	}
	constructor() {
		this._keyMap = new Map<string, number>();
		this._valueMap = new Map<string, number>();
		this._keyValueMap = new KeyValueMap();
		this._lineMap = new Map<string, number>();
		this._fileName = '';
	}
}
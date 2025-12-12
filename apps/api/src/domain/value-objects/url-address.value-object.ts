export class URLAddressVO {
  constructor(private _URL: string) { }

  get URL(): string {
    return this._URL;
  }
}

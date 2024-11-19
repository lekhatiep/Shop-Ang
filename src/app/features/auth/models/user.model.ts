export class User {
  constructor(
    public email: string,
    private _token: string,
    public _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || (this._tokenExpirationDate < new Date())) {
      return null;
    }
    return this._token;
  }
}

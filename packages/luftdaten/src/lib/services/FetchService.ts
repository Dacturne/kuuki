export class FetchService implements IFetch {
  constructor(private _fetch: any) {
    //
  }

  public fetch(url: RequestInfo, init?: RequestInit): Promise<Response> {
    return this._fetch(url, init);
  }
}

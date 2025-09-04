export class User {
  constructor(
    public username: string,
    public password: string,
    public likes: number[],
    public id?: number
  ) {}
}

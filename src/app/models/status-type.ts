export class StatusType {
  id: string = ""
  name: string = ""
  weight: number = 0

  public constructor(init?:Partial<StatusType>) {
    Object.assign(this, init);
  }
}

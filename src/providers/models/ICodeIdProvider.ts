export default interface ICodeIdProvider {
  create(): Promise<string>;
}

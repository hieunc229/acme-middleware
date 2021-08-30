export default abstract class AcmeDNSClientAbstract {
    abstract createRecord<T = any>(path: string, type: string, value: string): Promise<T>;
    abstract removeRecord<T = any>(data: any): Promise<T>;
}

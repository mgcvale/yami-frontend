export interface EntityStat {
    name: string,
    nameClassName: string,
    count: number,
    countClassName: string,
    onClick?: (e: Event) => void
};
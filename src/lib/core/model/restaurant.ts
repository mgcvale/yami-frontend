export default interface Restaurant {
    id: number,
    name: string,
    shortName: string,
    description: string,
    reviewCount: number,
    foodCount: number,
    location?: string
};
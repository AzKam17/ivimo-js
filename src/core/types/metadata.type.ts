export type Metadata = {
    [key: string]: string | boolean | number | undefined | Metadata | number[] | Metadata[] | object;
};
export type UserProfile = {
    country: string;
    display_name: string;
    email: string;
    images: Array<ImageObject>;
    type: string;
    product: 'premium' | 'free' | 'open';
    uri: string;
}

type ImageObject = {
    url: string;
    height: number;
    width: number;
}
export interface ApiResponse {
    success: boolean;
    message: string;
    isAceptingMessage?: boolean,
    data?: { feedback: ApiMessage[], totalCount: number }
};


export interface ApiMessage {
    content: string,
    createdAt: Date,
    _id: string,
}
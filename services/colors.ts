import { axiosInstance } from "./instance"
import { ApiRoutes } from "./constans";
import { Color } from "@prisma/client";

export const getAll = async (): Promise<Color[]> => {
    return (await axiosInstance.get<Color[]>(ApiRoutes.COLORS)).data;
}
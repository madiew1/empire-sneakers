import { axiosInstance } from "./instance"
import { ApiRoutes } from "./constans";
import { Brand } from "@prisma/client";

export const getAll = async (): Promise<Brand[]> => {
    return (await axiosInstance.get<Brand[]>(ApiRoutes.BRANDS)).data;
}
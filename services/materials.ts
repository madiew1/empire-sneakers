import { Material } from "@prisma/client";
import { axiosInstance } from "./instance"
import { ApiRoutes } from "./constans";

export const getAll = async (): Promise<Material[]> => {
    return (await axiosInstance.get<Material[]>(ApiRoutes.MATERIALS)).data;
}
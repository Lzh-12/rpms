import { sendRequest } from "@/utils/request";

// 获取所有机构信息
export const getInstitutionsInfo = () => {
    return sendRequest("get", '/info/institutions');
}
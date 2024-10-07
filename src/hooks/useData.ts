import { useCallback } from "react"
import useApi from "./useApi"

const useData = () => {
    const callapi = useApi()
    const rootEndpoint = 'odata/CovidDailies'
    const getData = useCallback(async() => {
        try {
            const response = await callapi("get",rootEndpoint)
            return response
        } catch (error) {
            console.log(error);
        }
    }, [callapi])
    return {getData}
}
export default useData

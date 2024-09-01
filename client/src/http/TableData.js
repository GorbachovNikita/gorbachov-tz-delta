import {$host} from "./index";

export const addNewData = async (data) => {

    const response = await $host.post('api/table', {data})
    return response
}

export const getData = async () => {

    const response = await $host.get('api/table')
    return response
}
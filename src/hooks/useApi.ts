import { AxiosError, AxiosResponse } from 'axios'
import { useCallback } from 'react'
import { get, patch, post, put, remove } from '../utils/api.caller'

const useApi = () => {

  /**
   * Function Documentation: `callApi`
   *
   * The `callApi` function is an asynchronous function that provides a convenient way to make API calls using different HTTP methods (GET, POST, PUT, DELETE). It accepts several parameters to customize the request and returns the response data from the API.
   *
   * @param {string} method - The HTTP method to be used for the API call. It can be one of the following values: 'get', 'post', 'put', 'delete'.
   * @param {string} endpoint - The endpoint or URL where the API call should be made.
   * @param {object} headers - (optional) Additional headers to be included in the API request. Default is an empty object.
   * @param {object} params - (optional) Query parameters to be included in the API request. Default is an empty object.
   * @param {object} body - (optional) Request body data to be included in the API request. Default is an empty object.
   *
   * @returns {Promise<any>} - A promise that resolves to the response data from the API.
   * @throws {Error} - If an error occurs during the API call.
   */
  const callApi = useCallback(
    async (
      method: 'get' | 'post' | 'put' | 'delete' | 'patch',
      endpoint: string,
      headers: object = {},
      params: object = {},
      body: object = {}
    ) => {
      let response: AxiosResponse
      try {
        switch (method) {
          case 'get': {
            response = await get(endpoint, params, headers)
            break
          }
          case 'post': {
            response = await post(endpoint, body, params, headers)
            break
          }
          case 'put': {
            response = await put(endpoint, body, params, headers)
            break
          }
          case 'delete': {
            response = await remove(endpoint, body, params, headers)
            break
          }
          case 'patch': {
            response = await patch(endpoint, body, params, headers)
            break
          }
        }
        return response.data
      } catch (error) {
        console.log(error)
      }
    },
    []
  )

  return callApi
}

export default useApi
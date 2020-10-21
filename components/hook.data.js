import {useState, useCallback} from 'react'

export const useData = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const request = useCallback( async (url) => {
      setLoading(true)
      const response = await fetch(url, {
        method: 'GET', 
        headers: {
          'token': 'OjEytOjyDWXeESKGtizkKGJgGukXiNJu'
      }
      });
      const data = await response.json();
      setLoading(false)
      return data
      
    }, [])
    return {loading, request, error}
}
import { useEffect, useState } from 'react'

export function DatabaseTest() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('Testing getAll API...')
        const response = await fetch('http://localhost:8080/api/getAll')
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        const result = await response.json()
        console.log('API Response:', result)
        setData(result)
      } catch (err) {
        console.error('API Error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    
    testAPI()
  }, [])

  if (loading) return <div>Testing database connection...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      <h3>Database Test Results:</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
} 
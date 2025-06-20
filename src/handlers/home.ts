import type { Context } from 'hono'

const homeHandler = (c: Context) => {
  console.log('🏠 Home handler executed')
  return c.text('Welcome to the Hono + TypeScript Home Page!')
}

export default homeHandler

import type { Context } from 'hono'

const aboutHandler = (c: Context) => {
  console.log('ℹ️ About handler executed')
  return c.text('This is the About Page built with Hono and TypeScript.')
}

export default aboutHandler

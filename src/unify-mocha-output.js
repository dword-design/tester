import { replace } from '@dword-design/functions'

export default x =>
  x |> replace(/(\d+) passing( \(\d+ms\))?/, '$1 passing') |> replace(/√/g, '✓')

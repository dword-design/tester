import { endent } from '@dword-design/functions'

import self from './unify-mocha-output'

export default [
  () =>
    expect(
      self(endent`
  
    index
      ✓ test1
      ✓ test2
  
  
    2 passing (7ms)
    
  `)
    ).toEqual(endent`
  
    index
      ✓ test1
      ✓ test2


    2 passing
    
  `),
  () =>
    expect(
      self(endent`
  
    index
      √ test1
      √ test2
  
  
    2 passing (7ms)
    
  `)
    ).toEqual(endent`
  
    index
      ✓ test1
      ✓ test2


    2 passing
    
  `),
]

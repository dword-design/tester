import { endent, mapValues } from '@dword-design/functions'
import packageName from 'depcheck-package-name'
import execa from 'execa'
import { outputFile } from 'fs-extra'
import withLocalTmpDir from 'with-local-tmp-dir'

const runTest = config => () =>
  withLocalTmpDir(async () => {
    await outputFile('index.spec.js', config.tests)
    const output = await execa.command(
      `mocha --ui ${packageName`mocha-ui-exports-auto-describe`} index.spec.js`,
      { all: true }
    )
    if (config.outputMatcher) {
      expect(output.all).toMatch(config.outputMatcher)
    }
  })

export default {
  'after hook': {
    outputMatcher: new RegExp(endent`
      ^

        index
          . test1
          . test2
      after
      
      
        2 passing \\(\\d+ms\\)
      $
    `),
    tests: endent`
      import self from '../src'

      export default self(
        {
          test1: () => {},
          test2: () => {},
        },
        [{
          after: () => console.log('after'),
        }]
      )
    `,
  },
  'afterEach hook': {
    outputMatcher: new RegExp(endent`
      ^

        index
          . test1
      afterEach
          . test2
      afterEach
      
      
        2 passing \\(\\d+ms\\)
      $
    `),
    tests: endent`
      import self from '../src'

      export default self(
        {
          test1: () => {},
          test2: () => {},
        },
        [{
          afterEach: () => console.log('afterEach'),
        }]
      )
    `,
  },
  'before hook': {
    outputMatcher: new RegExp(endent`
      ^

        index
      before
      foobar
          . test1
      foobar
          . test2
      
      
        2 passing \\(\\d+ms\\)
      $
    `),
    tests: endent`
      import self from '../src'

      let counter = 1

      export default self(
        {
          test1() {
            console.log(this.foo)
          },
          test2() {
            console.log(this.foo)
          },
        },
        [{
          before() {
            this.foo = 'foobar'
            console.log('before')
          }
        }]
      )
    `,
  },
  'beforeEach hook': {
    outputMatcher: new RegExp(endent`
      ^

        index
      beforeEach
      foobar1
          . test1
      beforeEach
      foobar2
          . test2
      
      
        2 passing \\(\\d+ms\\)
      $
    `),
    tests: endent`
      import self from '../src'

      let counter = 1

      export default self(
        {
          test1() {
            console.log(this.foo)
          },
          test2() {
            console.log(this.foo)
          },
        },
        [{
          beforeEach() {
            this.foo = \`foobar\${counter}\`
            counter += 1
            console.log('beforeEach')
          }
        }]
      )
    `,
  },
  empty: {
    outputMatcher: new RegExp(endent`
      ^

        index
          . works
      
      
        1 passing \\(\\d+ms\\)
      $
    `),
    tests: endent`
      import self from '../src'

      export default self({ works: () => {} })
    `,
  },
  'multiple plugins': {
    outputMatcher: new RegExp(endent`
      ^

        index
      before1
      before2
          . test
      after2
      after1
      
      
        1 passing \\(\\d+ms\\)
      $
    `),
    tests: endent`
      import self from '../src'

      let counter = 1

      export default self(
        {
          test: () => {}
        },
        [
          {
            before: () => console.log('before1'),
            after: () => console.log('after1'),
          },
          {
            before: () => console.log('before2'),
            after: () => console.log('after2'),
          }
        ]
      )
    `,
  },
} |> mapValues(runTest)

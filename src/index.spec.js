import { endent, mapValues } from '@dword-design/functions'
import packageName from 'depcheck-package-name'
import execa from 'execa'
import { outputFile } from 'fs-extra'
import withLocalTmpDir from 'with-local-tmp-dir'
import unifyMochaOutput from './unify-mocha-output'

const runTest = config =>
  function () {
    return withLocalTmpDir(async () => {
      await outputFile('index.spec.js', config.tests)
      const output = await execa.command(
        `mocha --ui ${packageName`mocha-ui-exports-auto-describe`} index.spec.js`,
        { all: true }
      )
      expect(output.all |> unifyMochaOutput).toMatchSnapshot(this)
    })
  }

export default {
  'after hook': {
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
    tests: endent`
      import self from '../src'

      export default self({ works: () => {} })
    `,
  },
  'multiple plugins': {
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
  transform: {
    tests: endent`
      import self from '../src'

      export default self(
        {
          test1: {
            a: { b: () => {} },
          },
          test2: {
            a: { b: () => {} },
          },
        },
        [
          { transform: test => test.a },
          { transform: test => test.b },
        ],
      )
    `,
  },
} |> mapValues(runTest)

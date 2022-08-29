import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {parseInputFiles, getDefaultPlatformArch} from './utils'

async function run(): Promise<void> {
  try {
    const packages = parseInputFiles(core.getInput('package') || './...')
    core.debug(`packages = ${packages}`)

    const testArgs = core.getInput('args') || ''
    core.debug(`args = ${testArgs}`)

    const match = core.getInput('match') || ''
    core.debug(`match = ${match}`)

    const shuffle = core.getInput('shuffle') || 'off'
    core.debug(`shuffle = ${shuffle}`)

    const parallel = parseInt(core.getInput('parallel') || '0')
    core.debug(`parallel = ${parallel}`)

    const failfast = core.getInput('failfast') === 'true'
    core.debug(`failfast = ${failfast}`)

    const cover = core.getInput('cover') || 'off'
    core.debug(`cover = ${cover}`)

    const platforms = parseInputFiles(
      core.getInput('platforms') || getDefaultPlatformArch()
    )
    core.debug(`platforms = ${platforms}`)

    const tags = parseInputFiles(core.getInput('tags') || '')
    core.debug(`tags = ${tags}`)

    let args = ['test', '-json']

    if (shuffle) {
      args = args.concat('-shuffle', shuffle)
    }

    if (parallel) {
      args = args.concat('-parallel', parallel.toString())
    }

    if (failfast) {
      args = args.concat('-failfast')
    }

    if (cover !== 'off') {
      args = args.concat('-cover', '-covermode', cover)
    }

    if (match) {
      args = args.concat('-run', match)
    }

    if (tags && tags.length) {
      args = args.concat('-tags', tags.join(','))
    }

    core.debug(`args = ${args}`)

    for (const platform of platforms) {
      core.debug(`platform = ${platform}`)

      const [osPlatform, osArch] = platform.split('/')

      for (const pkg of packages) {
        core.debug(`pkg = ${pkg}`)

        const env = process.env as {[key: string]: string}
        env['GOOS'] = osPlatform
        env['GOARCH'] = osArch

        core.info(`Testing ${pkg}`)

        let finalArgs = args.concat(pkg)
        if (testArgs) {
          finalArgs = finalArgs.concat('-args', testArgs)
        }
        core.debug(`go ${finalArgs.join(' ')}`)

        await exec.exec('go', finalArgs, {
          env
        })
      }
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()

import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {getConfig} from './config'

async function run(): Promise<void> {
  try {
    const config = await getConfig()

    let args = ['test', '-v']

    if (config.shuffle) {
      args = args.concat('-shuffle', config.shuffle)
    }

    if (config.parallel) {
      args = args.concat('-parallel', config.parallel.toString())
    }

    if (config.failfast) {
      args = args.concat('-failfast')
    }

    if (config.cover) {
      args = args.concat('-cover')
    }

    if (config.covermode !== 'set') {
      args = args.concat('-covermode', config.covermode)
    }

    if (config.coverprofile) {
      args = args.concat('-coverprofile=' + config.coverprofile)
    }

    if (config.match) {
      args = args.concat('-run', config.match)
    }

    if (config.tags && config.tags.length) {
      args = args.concat('-tags', config.tags.join(','))
    }

    core.debug(`args = ${args}`)

    for (const platform of config.platforms) {
      core.debug(`platform = ${platform}`)

      const [osPlatform, osArch] = platform.split('/')

      for (const pkg of config.packages) {
        core.debug(`pkg = ${pkg}`)

        const env = process.env as {[key: string]: string}
        env['GOOS'] = osPlatform
        env['GOARCH'] = osArch

        core.info(`Testing ${pkg}`)

        let finalArgs = args.concat(pkg)
        if (config.testArgs) {
          finalArgs = finalArgs.concat('-args', config.testArgs)
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

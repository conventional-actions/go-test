import * as core from '@actions/core'
import {parseMultiInput} from '@conventional-actions/toolkit'
import {getDefaultPlatformArch} from './utils'

type Config = {
  packages: string[]
  testArgs: string
  match: string
  shuffle: string
  parallel: number
  failfast: boolean
  cover: string
  platforms: string[]
  tags: string[]
}

export async function getConfig(): Promise<Config> {
  return {
    packages: parseMultiInput(core.getInput('package') || './...'),
    testArgs: core.getInput('args') || '',
    match: core.getInput('match') || '',
    shuffle: core.getInput('shuffle') || 'off',
    parallel: parseInt(core.getInput('parallel') || '0'),
    failfast: core.getInput('failfast') === 'true',
    cover: core.getInput('cover') || 'off',
    platforms: parseMultiInput(
      core.getInput('platforms') || getDefaultPlatformArch()
    ),
    tags: parseMultiInput(core.getInput('tags') || '')
  }
}

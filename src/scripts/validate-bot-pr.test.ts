import assert from 'node:assert/strict';
import childProcess from 'node:child_process';
import { describe, it, mock } from 'node:test';

import { git, tryGit } from '../../scripts/validate-bot-pr.mjs';

describe('tryGit', () => {
  it('returns trimmed output when git execution succeeds', () => {
    const output = tryGit('rev-parse', '--verify', 'HEAD');

    assert.equal(typeof output, 'string');
    assert.ok((output as string).length > 0);
  });

  it('returns null when child_process.execFileSync throws an error', () => {
    const execFileSyncMock = mock.method(childProcess, 'execFileSync', () => {
      throw new Error('Command failed: git');
    });

    const result = tryGit('rev-parse', '--verify', 'HEAD');

    assert.equal(result, null);
    assert.equal(execFileSyncMock.mock.calls.length, 1);

    execFileSyncMock.mock.restore();
  });

  it('returns null when git fails with invalid arguments', () => {
    const result = tryGit('invalid-git-subcommand-xyz');

    assert.equal(result, null);
  });
});

describe('git', () => {
  it('returns trimmed string output when git command succeeds', () => {
    const output = git('rev-parse', '--verify', 'HEAD');

    assert.equal(typeof output, 'string');
    assert.ok(output.length > 0);
  });

  it('throws error when git command fails', () => {
    assert.throws(() => git('invalid-git-subcommand-xyz'));
  });
});

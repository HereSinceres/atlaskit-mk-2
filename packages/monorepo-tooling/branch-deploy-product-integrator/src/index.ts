import chalk from 'chalk';
import meow from 'meow';
import simpleGit from 'simple-git/promise';
import util from 'util';
import childProcess from 'child_process';
import { createSpyObject } from '@atlaskit/build-utils/logging';

//@ts-ignore
import installFromCommit from '@atlaskit/branch-installer';

import fetch from 'node-fetch';

const exec = util.promisify(childProcess.exec);

// prettier-ignore
const HELP_MSG = `
  🚀 Atlaskit branch deploy product integrator™ 🚀

   ${chalk.green('Options')}
    ${chalk.green('Mandatory')}
     ${chalk.yellow('--atlaskitCommitHash')} Atlaskit commit hash of the branch deploy that needs to be installed
     ${chalk.yellow('--atlaskitBranchName')} The name of the Atlaskit branch being installed

    ${chalk.green('Optional')}
     ${chalk.yellow('--branchPrefix')} Prefix for the generated branch [default=atlaskit-branch-deploy/]
     ${chalk.yellow('--cmd')} the command to use can be add or upgrade [default=upgrade]
     ${chalk.yellow('--dedupe')} run yarn deduplicate at the end to deduplicate the lock file
     ${chalk.yellow('--dryRun')} Log out commands that would be run instead of running them
     ${chalk.yellow('--packageEngine')} The package manager to use, currently only tested with Bolt and yarn [default=yarn]
     ${chalk.yellow('--packages')} comma delimited list of packages to install branch deploy of
     ${chalk.yellow('--productCiPlanUrl')} Base URL of the product CI's plan rest endpoint, including build key.
     ${chalk.yellow('--')} Any arguments after -- will be appended to the upgrade command

  ${chalk.green('Environment Variables')}
    ${chalk.yellow('PRODUCT_CI_USERNAME')} Username to authenticate product CI API requests with, used in conjunction with --productCiPlanUrl
    ${chalk.yellow('PRODUCT_CI_PASSWORD')} Password to authenticate product CI API requests with, used in conjunction with --productCiPlanUrl

  ${chalk.green('Examples')}
    ${chalk.yellow('branch-deploy-product-integrator --atlaskitBranchName foo --atlaskitCommitHash abcdef123456 --productCiPlanUrl https://bamboo.atlassian.com/rest/api/latest/plan/ABC-DEF')}

`;

function createBranchName(atlaskitBranchName: string, prefix: string) {
  return `${prefix}${atlaskitBranchName}`.replace(/\//g, '-');
}

type Auth = {
  username: string;
  password: string;
};

async function triggerProductBuild(
  planUrl: string,
  branchName: string,
  auth: Auth,
) {
  const branchPlanUrl = `${planUrl}/branch/${branchName}?os_authType=basic&vcsBranch=${branchName}&cleanupEnabled=true`;
  const credentials = Buffer.from(`${auth.username}:${auth.password}`).toString(
    'base64',
  );
  const headers = {
    Accept: 'application/json',
    Authorization: `Basic ${credentials}`,
  };
  let planBranchExists = false;
  try {
    const response = await fetch(branchPlanUrl, {
      method: 'GET',
      headers,
    });
    if (response.ok) {
      planBranchExists = true;
    }
  } catch (e) {
    // An error here means an error occurred while fetching, e.g. network. We can ignore this.
  }

  if (planBranchExists) {
    // Nothing to do here
    return;
  }

  const response = await fetch(branchPlanUrl, {
    method: 'PUT',
    headers,
  });
  if (!response.ok) {
    const payload = await response.json();
    throw Error(
      `Could not create branch build in product - Status code: ${
        response.status
      } - ${JSON.stringify(payload)}`,
    );
  }
}

export async function run() {
  const cli = meow(HELP_MSG, {
    flags: {
      branchPrefix: {
        type: 'string',
        default: 'atlaskit-branch-deploy-',
      },
      atlaskitBranchName: {
        type: 'string',
      },
      packageEngine: {
        type: 'string',
        default: 'yarn',
      },
      atlaskitCommitHash: {
        type: 'string',
      },
      packages: {
        type: 'string',
        default: 'all',
      },
      dedupe: {
        type: 'boolean',
        default: false,
      },
      cmd: {
        type: 'string',
        default: 'upgrade',
      },
      dryRun: {
        type: 'boolean',
        default: false,
      },
      productCiPlanUrl: {
        type: 'string',
      },
    },
  });
  const {
    atlaskitBranchName,
    atlaskitCommitHash,
    branchPrefix,
    packageEngine,
    packages,
    dedupe,
    cmd,
    dryRun,
    productCiPlanUrl,
    ...rest
  } = cli.flags;
  const extraArgs = cli.input;

  if (!atlaskitBranchName || !atlaskitCommitHash) {
    console.error(
      chalk.red('Missing atlaskitBranchName or atlaskitCommitHash'),
    );
    cli.showHelp(2);
  }

  const invalidFlags = Object.keys(rest);
  if (invalidFlags.length > 0) {
    console.error(chalk.red(`Invalid flags: ${invalidFlags}`));
    cli.showHelp(2);
  }

  const git = dryRun ? createSpyObject('git') : simpleGit('./');
  const branchName = createBranchName(atlaskitBranchName, branchPrefix);

  const remote = await git.listRemote(['--get-url']);

  if (!dryRun && remote.indexOf('atlassian/atlaskit-mk-2') > -1) {
    throw new Error('Working path should not be the Atlaskit repo!');
  }

  let branchExists;

  try {
    await git.revparse(['--verify', `origin/${branchName}`]);
    branchExists = true;
  } catch (error) {
    branchExists = false;
  }

  if (branchExists) {
    await git.checkout(branchName);
    await git.pull('origin', branchName);
  } else {
    await git.checkoutBranch(branchName, 'origin/master');
  }

  await installFromCommit(atlaskitCommitHash, {
    engine: packageEngine,
    cmd: cmd,
    packages: packages,
    timeout: 30 * 60 * 1000, // Takes between 15 - 20 minutes to build a AK branch deploy
    interval: 30000,
    extraArgs,
    dryRun,
  });

  await git.add(['./']);

  const commitInfo = await (await fetch(
    `https://api.bitbucket.org/2.0/repositories/atlassian/atlaskit-mk-2/commit/${atlaskitCommitHash}`,
    {},
  )).json();
  const emailRegex = /^.*<([A-z]+@atlassian.com)>$/;

  let authorEmail = 'no-reply@atlassian.com';
  if (commitInfo.author.raw.match(emailRegex)) {
    authorEmail = commitInfo.author.raw.replace(emailRegex, '$1');
  }

  // prettier-ignore
  const commitMessage = `Upgraded to Atlaskit changes on branch ${cli.flags.atlaskitBranchName}

https://bitbucket.org/atlassian/atlaskit-mk-2/branch/${cli.flags.atlaskitBranchName}

This commit was auto-generated.
  `;

  await git.commit(commitMessage, [
    '--author',
    `BOT Atlaskit branch deploy integrator <${authorEmail}>`,
  ]);
  await git.push('origin', branchName);

  if (dedupe) {
    console.log(chalk.yellow('Running yarn-deduplicate'));
    await exec('yarn yarn-deduplicate yarn.lock');
    await git.add(['./']);

    await git.commit(`Deduplicated yarn.lock file`, [
      '--author',
      `BOT Atlaskit branch deploy integrator <${authorEmail}>`,
    ]);
    await git.push('origin', branchName);
  }

  if (productCiPlanUrl) {
    const { PRODUCT_CI_USERNAME, PRODUCT_CI_PASSWORD } = process.env;
    if (!PRODUCT_CI_USERNAME || !PRODUCT_CI_PASSWORD) {
      throw Error(
        'Missing $PRODUCT_CI_USERNAME and/or $PRODUCT_CI_PASSWORD environment variables',
      );
    }
    await triggerProductBuild(productCiPlanUrl, branchName, {
      username: PRODUCT_CI_USERNAME,
      password: PRODUCT_CI_PASSWORD,
    });
  }
}

// @flow
const bolt = require('bolt');

/*::
type releaseType = {
  name: string,
  type: string,
}
type dependentType = {
  name: string,
  type?: string,
  dependencies: Array<string>,
  finalised?: boolean
}
type changesetType = {
  summary: string,
  releases: Array<releaseType>,
  dependents: Array<dependentType>,
  releaseNotes?: any,
}
type workspaceType = {
  config: {
    dependencies?: {},
    devDependencies?: {},
    peerDependencies?: {},
    bundledDependencies?: {},
    optionalDependencies?: {},
  },
  name: string
}
*/

function getMustUpdateOn(
  allWorkSpaces /*: Array<workspaceType> */,
  dependent /*: dependentType */,
  nextDependency /*: string */,
) {
  const workspace = allWorkSpaces.find(ws => ws.name === dependent.name);
  if (!workspace)
    throw new Error(
      `updating failed, no package found, ${dependent.name}, ${nextDependency}`,
    );
  const pkg = workspace.config;
  const DEPENDENCY_TYPES = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'bundledDependencies',
    'optionalDependencies',
  ];
  let allDependencies = new Map();

  for (let type of DEPENDENCY_TYPES) {
    let deps = pkg[type];
    if (!deps) continue;

    for (let name of Object.keys(deps)) {
      allDependencies.set(name, deps[name]);
    }
  }

  const range = allDependencies.get(nextDependency);
  if (!range)
    throw new Error(
      `conflicting messages around whether ${
        nextDependency
      } is depended on by ${dependent.name}`,
    );

  if (/^\^\d+\.\d+\.\d+$/.test(range))
    return {
      symbol: '^',
      mustUpdateOn: ['major'],
    };
  if (/^~\d+\.\d+\.\d+$/.test(range))
    return {
      symbol: '~',
      mustUpdateOn: ['major', 'minor'],
    };
  if (/^\d+\.\d+\.\d+$/.test(range))
    return {
      symbol: '',
      mustUpdateOn: ['major', 'minor', 'patch'],
    };
  throw new Error(
    `Invalid version range for internal dependency  ${
      nextDependency
    } in workspace ${dependent.name} , ${
      range
    }. Only carat, tilde or exact semver ranges are accepted.`,
  );
}

module.exports = getMustUpdateOn;

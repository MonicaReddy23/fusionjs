// @flow
const {getManifest} = require('../utils/get-manifest.js');
const {spawn, remove} = require('../utils/node-helpers.js');
const {bazel} = require('../utils/binary-paths.js');

/*::
export type PurgeArgs = {
  root: string,
};
export type Purge = (PurgeArgs) => Promise<void>;
*/
const purge /*: Purge */ = async ({root}) => {
  const {projects = []} = await getManifest({root});
  projects.map(project => {
    remove(`${root}/${project}/node_modules`);
  });
  remove(`${root}/third_party/jazelle/temp`);
  remove(`${root}/node_modules`);
  await spawn(bazel, ['clean', '--expunge'], {
    cwd: root,
    stdio: 'inherit',
  }).catch(() => {}); // user doesn't care for our stack trace, just pipe bazel output instead
};

module.exports = {purge};

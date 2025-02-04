import {
  retrievePackageJson,
  getVersionedPackages,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
  copyTemplate,
} from '../../lib/helpers';

export default async (npmOptions, { storyFormat = 'csf' }) => {
  const packages = [
    '@storybook/vue',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
  ];
  if (storyFormat === 'mdx') {
    packages.push('@storybook/addon-docs');
  }
  const versionedPackages = await getVersionedPackages(npmOptions, ...packages);

  copyTemplate(__dirname, storyFormat);

  const packageJson = retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies(npmOptions, [...versionedPackages, ...babelDependencies]);
};

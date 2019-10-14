import * as bolt from 'bolt';
import runCommands from '@atlaskit/build-utils/runCommands';
import { getPackagesInfo } from '@atlaskit/build-utils/tools';
import createEntryPointsDirectories from '../create.entry.points.directories';
import copyVersion from '../copy.version';
import validateDists from '../validate.dists';

import build from '../build';

jest.enableAutomock();
jest.unmock('../build');
jest.mock('../validate.dists', () =>
  jest.fn(() => Promise.resolve({ success: true })),
);
jest.mock('../get.glob.packages.for.tools', () =>
  jest.fn((tools: string[]) => `${tools.join('-')}-glob`),
);

describe('Build', () => {
  let consoleErrorSpy: jest.SpyInstance<Console['error']>;
  let consoleLogSpy: jest.SpyInstance<Console['log']>;

  beforeAll(() => {
    // Comment out the mockImplementation to read console.logs for debugging
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error');
  });
  afterAll(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (getPackagesInfo as any).mockImplementation(() => [
      {
        name: '@atlaskit/editor-core',
        relativeDir: 'packages/editor/editor-core',
        isTypeScript: true,
      },
    ]);
  });
  describe('All packages', () => {
    it('should create entry point directories', async () => {
      expect(createEntryPointsDirectories).not.toHaveBeenCalled();
      await build(undefined, { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(createEntryPointsDirectories).toHaveBeenCalledTimes(1);
      expect(createEntryPointsDirectories).toHaveBeenCalledWith({
        cwd: '/Users/dev/atlaskit-mk-2',
        packageName: undefined,
      });
    });
    it('should build all JS packages', async () => {
      expect(runCommands).not.toHaveBeenCalled();
      await build(undefined, { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(runCommands).toHaveBeenNthCalledWith(
        1,
        [
          'NODE_ENV=production BABEL_ENV=production:cjs bolt workspaces exec --parallel --only-fs "babel-glob" -- babel src -d dist/cjs --root-mode upward',
          'NODE_ENV=production BABEL_ENV=production:esm bolt workspaces exec --parallel --only-fs "babel-glob" -- babel src -d dist/esm --root-mode upward',
          'bolt workspaces exec --only-fs "babel-flow-glob" -- flow-copy-source -i \'**/__tests__/**\' src dist/cjs',
          'bolt workspaces exec --only-fs "babel-flow-glob" -- flow-copy-source -i \'**/__tests__/**\' src dist/esm',
        ],
        {},
      );
    });
    it('should build all TS packages', async () => {
      expect(runCommands).not.toHaveBeenCalled();
      await build(undefined, { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(runCommands).toHaveBeenNthCalledWith(
        2,
        [
          'NODE_ENV=production bolt workspaces exec --only-fs "typescript-glob" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/cjs --module commonjs && echo Success || true\'',
          'NODE_ENV=production bolt workspaces exec --only-fs "typescript-glob" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/esm --module esnext && echo Success || true\'',
          'NODE_ENV=production bolt workspaces exec --only-fs "typescriptcli-glob" -- bash -c \'tsc --project ./build/cli && echo Success || true\'',
        ],
        { sequential: true },
      );
    });
    it('should run ak-postbuild scripts for exception packages', async () => {
      expect(bolt.workspacesRun).not.toHaveBeenCalled();
      await build(undefined, { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(bolt.workspacesRun).toHaveBeenCalledTimes(1);
      expect(bolt.workspacesRun).toHaveBeenCalledWith({
        cwd: '/Users/dev/atlaskit-mk-2',
        filterOpts: {
          only: undefined,
        },
        spawnOpts: {
          orderMode: 'parallel',
        },
        script: 'ak-postbuild',
      });
    });
    it('should copy all version.json across', async () => {
      expect(copyVersion).not.toHaveBeenCalled();
      await build(undefined, { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(copyVersion).toHaveBeenCalledTimes(1);
      expect(copyVersion).toHaveBeenCalledWith(undefined);
    });
    it('should validate dists', async () => {
      // Success
      expect(validateDists).not.toHaveBeenCalled();
      await build(undefined, { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(validateDists).toHaveBeenCalledTimes(1);
      expect(validateDists).toHaveBeenCalledWith({
        cwd: '/Users/dev/atlaskit-mk-2',
        packageName: undefined,
      });

      // Failure
      (validateDists as any).mockImplementationOnce(() => ({
        success: false,
        packageDistErrors: ['Missing entry point directory for foo'],
      }));
      await expect(
        build(undefined, { cwd: '/Users/dev/atlaskit-mk-2' }),
      ).rejects.toThrow(
        /1 errors detected in package dists:\n.*\* Missing entry point directory for foo\n\n.*If dist has included dependencies and changed the file structure, run yarn build:multi-entry-point-tsconfig and try again./,
      );
    });
  });

  describe('Single package', () => {
    it('should create entry point directory', async () => {
      expect(createEntryPointsDirectories).not.toHaveBeenCalled();
      await build('editor-core', { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(createEntryPointsDirectories).toHaveBeenCalledTimes(1);
      expect(createEntryPointsDirectories).toHaveBeenCalledWith({
        cwd: '/Users/dev/atlaskit-mk-2',
        packageName: '@atlaskit/editor-core',
      });
    });
    it('should build JS package if it is JS', async () => {
      (getPackagesInfo as any).mockImplementation(() => [
        {
          name: '@atlaskit/navigation-next',
          relativeDir: 'packages/core/navigation-next',
          isBabel: true,
          isFlow: true,
        },
      ]);

      expect(runCommands).not.toHaveBeenCalled();
      await build('navigation-next', { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(runCommands).toHaveBeenNthCalledWith(
        1,
        [
          'NODE_ENV=production BABEL_ENV=production:cjs bolt workspaces exec --parallel --only-fs "packages/core/navigation-next" -- babel src -d dist/cjs --root-mode upward',
          'NODE_ENV=production BABEL_ENV=production:esm bolt workspaces exec --parallel --only-fs "packages/core/navigation-next" -- babel src -d dist/esm --root-mode upward',
          'bolt workspaces exec --only-fs "packages/core/navigation-next" -- flow-copy-source -i \'**/__tests__/**\' src dist/cjs',
          'bolt workspaces exec --only-fs "packages/core/navigation-next" -- flow-copy-source -i \'**/__tests__/**\' src dist/esm',
        ],
        {},
      );
      // Does not try to build TS
      expect(runCommands).toHaveBeenNthCalledWith(2, [], { sequential: false });
    });
    it('should build TS package if it is TS', async () => {
      expect(runCommands).not.toHaveBeenCalled();
      await build('editor-core', { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(runCommands).toHaveBeenNthCalledWith(
        2,
        [
          'NODE_ENV=production bolt workspaces exec --only-fs "packages/editor/editor-core" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/cjs --module commonjs && echo Success || true\'',
          'NODE_ENV=production bolt workspaces exec --only-fs "packages/editor/editor-core" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/esm --module esnext && echo Success || true\'',
        ],
        { sequential: false },
      );
      // Does not try to build JS
      expect(runCommands).toHaveBeenNthCalledWith(1, [], {});
    });
    it('should run exception postbuild for package, if one exists', async () => {
      expect(bolt.workspacesRun).not.toHaveBeenCalled();
      await build('editor-core', { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(bolt.workspacesRun).toHaveBeenCalledTimes(1);
      expect(bolt.workspacesRun).toHaveBeenCalledWith({
        cwd: '/Users/dev/atlaskit-mk-2',
        filterOpts: {
          only: '@atlaskit/editor-core',
        },
        spawnOpts: {
          orderMode: 'parallel',
        },
        script: 'ak-postbuild',
      });
    });
    it('should copy version.json across', async () => {
      expect(copyVersion).not.toHaveBeenCalled();
      await build('editor-core', { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(copyVersion).toHaveBeenCalledTimes(1);
      expect(copyVersion).toHaveBeenCalledWith('@atlaskit/editor-core');
    });
    it('should validate dist', async () => {
      expect(validateDists).not.toHaveBeenCalled();
      await build('editor-core', { cwd: '/Users/dev/atlaskit-mk-2' });
      expect(validateDists).toHaveBeenCalledTimes(1);
      expect(validateDists).toHaveBeenCalledWith({
        cwd: '/Users/dev/atlaskit-mk-2',
        packageName: '@atlaskit/editor-core',
      });
    });

    describe('Package names', () => {
      it('should handle both full and shortened package name arg', async () => {
        // Shortened
        expect(getPackagesInfo).not.toHaveBeenCalled();
        await build('editor-core', { cwd: '/Users/dev/atlaskit-mk-2' });
        expect(getPackagesInfo).toHaveBeenCalledTimes(1);
        expect(getPackagesInfo).toHaveBeenCalledWith(
          '/Users/dev/atlaskit-mk-2',
          {
            only: 'editor-core',
          },
        );
        jest.clearAllMocks();

        // Full
        expect(getPackagesInfo).not.toHaveBeenCalled();
        await build('@atlaskit/editor-core', {
          cwd: '/Users/dev/atlaskit-mk-2',
        });
        expect(getPackagesInfo).toHaveBeenCalledTimes(1);
        expect(getPackagesInfo).toHaveBeenCalledWith(
          '/Users/dev/atlaskit-mk-2',
          {
            only: '@atlaskit/editor-core',
          },
        );
      });

      it('should throw if package name not found in repo', async () => {
        (getPackagesInfo as any).mockImplementation(() => []);
        await expect(
          build('foo', { cwd: '/Users/dev/atlaskit-mk-2' }),
        ).rejects.toThrow('Cannot find package "foo" in workspaces');
      });

      it('should throw if package name matches multiple packages', async () => {
        (getPackagesInfo as any).mockImplementation(() => [
          {
            name: '@atlaskit/editor-core',
            relativeDir: 'packages/editor/editor-core',
            isTypeScript: true,
          },
          {
            name: '@atlaskit/editor-common',
            relativeDir: 'packages/editor/editor-common',
            isTypeScript: true,
          },
        ]);

        await expect(
          build('editor', { cwd: '/Users/dev/atlaskit-mk-2' }),
        ).rejects.toThrow(
          'Matched multiple packages, provide an exact package name',
        );
      });
    });
  });

  describe('Watch mode', () => {
    it('should run the main build once before commencing watch', async () => {
      expect(runCommands).not.toHaveBeenCalled();
      await build('editor-core', {
        cwd: '/Users/dev/atlaskit-mk-2',
        watch: true,
      });
      // Entry point called twice since its run before compilation step
      expect(createEntryPointsDirectories).toHaveBeenCalledTimes(2);
      expect(runCommands).toHaveBeenCalledTimes(4);
      // Other steps are only called once since the second compilation is in watch mode which
      // pauses execution. In tests watch mode doesn't hang so we just verify they've been called
      expect(bolt.workspacesRun).toHaveBeenCalled();
      expect(copyVersion).toHaveBeenCalled();
      expect(validateDists).toHaveBeenCalled();
    });
    it('should run the JS compilation in watch mode for a JS package', async () => {
      (getPackagesInfo as any).mockImplementation(() => [
        {
          name: '@atlaskit/navigation-next',
          relativeDir: 'packages/core/navigation-next',
          isBabel: true,
          isFlow: true,
        },
      ]);

      expect(runCommands).not.toHaveBeenCalled();
      await build('navigation-next', {
        cwd: '/Users/dev/atlaskit-mk-2',
        watch: true,
      });
      expect(runCommands).toHaveBeenNthCalledWith(
        1,
        [
          'NODE_ENV=production BABEL_ENV=production:cjs bolt workspaces exec --parallel --only-fs "packages/core/navigation-next" -- babel src -d dist/cjs --root-mode upward',
          'NODE_ENV=production BABEL_ENV=production:esm bolt workspaces exec --parallel --only-fs "packages/core/navigation-next" -- babel src -d dist/esm --root-mode upward',
          'bolt workspaces exec --only-fs "packages/core/navigation-next" -- flow-copy-source -i \'**/__tests__/**\' src dist/cjs',
          'bolt workspaces exec --only-fs "packages/core/navigation-next" -- flow-copy-source -i \'**/__tests__/**\' src dist/esm',
        ],
        {},
      );
      // Does not try to build TS
      expect(runCommands).toHaveBeenNthCalledWith(2, [], expect.any(Object));

      expect(runCommands).toHaveBeenNthCalledWith(
        3,
        [
          'NODE_ENV=production BABEL_ENV=production:cjs bolt workspaces exec --parallel --only-fs "packages/core/navigation-next" -- babel src -d dist/cjs --root-mode upward -w --verbose',
          'NODE_ENV=production BABEL_ENV=production:esm bolt workspaces exec --parallel --only-fs "packages/core/navigation-next" -- babel src -d dist/esm --root-mode upward -w --verbose',
          'bolt workspaces exec --only-fs "packages/core/navigation-next" -- flow-copy-source -i \'**/__tests__/**\' src dist/cjs -w',
          'bolt workspaces exec --only-fs "packages/core/navigation-next" -- flow-copy-source -i \'**/__tests__/**\' src dist/esm -w',
        ],
        {
          onWatchSuccess: expect.any(Function),
          watchFirstSuccessCondition: expect.any(Function),
          watchSuccessCondition: expect.any(Function),
        },
      );
      // Does not try to build TS
      expect(runCommands).toHaveBeenNthCalledWith(4, [], expect.any(Object));
    });
    it('should run the TS compilation in watch mode for a TS package', async () => {
      expect(runCommands).not.toHaveBeenCalled();
      await build('editor-core', {
        cwd: '/Users/dev/atlaskit-mk-2',
        watch: true,
      });
      // Initial build
      expect(runCommands).toHaveBeenNthCalledWith(1, [], expect.any(Object));
      expect(runCommands).toHaveBeenNthCalledWith(
        2,
        [
          'NODE_ENV=production bolt workspaces exec --only-fs "packages/editor/editor-core" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/cjs --module commonjs && echo Success || true\'',
          'NODE_ENV=production bolt workspaces exec --only-fs "packages/editor/editor-core" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/esm --module esnext && echo Success || true\'',
        ],
        { sequential: false },
      );

      // Watch mode
      expect(runCommands).toHaveBeenNthCalledWith(3, [], expect.any(Object));
      expect(runCommands).toHaveBeenNthCalledWith(
        4,
        [
          'NODE_ENV=production bolt workspaces exec --only-fs "packages/editor/editor-core" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/cjs --module commonjs -w --preserveWatchOutput && echo Success || true\'',
          'NODE_ENV=production bolt workspaces exec --only-fs "packages/editor/editor-core" -- bash -c \'tsc --project ./build/tsconfig.json --outDir ./dist/esm --module esnext -w --preserveWatchOutput && echo Success || true\'',
        ],
        {
          sequential: false,
          onWatchSuccess: expect.any(Function),
          watchSuccessCondition: expect.any(Function),
        },
      );
    });
    it.todo(
      'should trigger `yalc push` on successful recompile of a JS package',
      async () => {},
    );
    it.todo(
      'should trigger `yalc push` on successful recompile of a TS package',
      async () => {},
    );
  });

  describe('distType option', () => {
    describe('All packages', () => {
      it.todo(
        'should only build cjs dist types when "cjs" distType option is passed',
        async () => {},
      );

      it.todo(
        'should only build esm dist types when "esm" distType option is passed',
        async () => {},
      );

      it.todo(
        'should not build any dist types when "none" distType option is passed',
        async () => {},
      );
    });

    describe('Single package', () => {
      it.todo(
        'should only build cjs dist types when "cjs" distType option is passed',
        async () => {},
      );

      it.todo(
        'should only build esm dist types when "esm" distType option is passed',
        async () => {},
      );

      it.todo(
        'should not build any dist types when "none" distType option is passed',
        async () => {},
      );
    });
  });
});

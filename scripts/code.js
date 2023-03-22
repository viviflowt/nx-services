#!/usr/bin/env node
// eslint-disable
const { Project } = require('ts-morph');
const path = require('path');
const fg = require('fast-glob');
const { dim } = require('colorette');
const fs = require('fs');
const { execSync } = require('child_process');

const project = new Project({
  tsConfigFilePath: path.resolve(__dirname, '../tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
});

const files = fg.sync(['apps/**/*.ts', 'libs/**/*.ts'], {
  onlyFiles: true,
  absolute: true,
  suppressErrors: true,
  ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/jest*'],
});

files.forEach((file) => project.addSourceFileAtPath(file));

const isNonRelativeImport = (importDeclaration) => {
  const moduleSpecifier = importDeclaration.getModuleSpecifierValue();
  return moduleSpecifier.startsWith('src');
};

const unusedIdentifiers = process.argv.slice(2).includes('--no-unused');
const missingImports = process.argv.slice(2).includes('--imports');

console.log(`codemod`, `${process.argv.slice(2).join(' ')}`, '\n');

project.getSourceFiles().forEach((sourceFile) => {
  console.info(dim(path.relative(process.cwd(), sourceFile.getFilePath())));

  if (missingImports) {
    // remove not found imports
    const importDeclarations = sourceFile.getImportDeclarations();

    if (importDeclarations.length > 0) {
      importDeclarations.forEach((importDeclaration) => {
        const moduleSpecifier = importDeclaration.getModuleSpecifierValue();
        if (!moduleSpecifier.startsWith('.')) {
          return;
        }

        if (
          !fs.existsSync(
            path.join(
              path.dirname(sourceFile.getFilePath()),
              moduleSpecifier + '.ts'
            )
          )
        ) {
          console.log('invalid:', moduleSpecifier);
          importDeclaration.remove();
        }
      });
    }
    sourceFile.fixMissingImports();
  }

  if (unusedIdentifiers) {
    sourceFile.fixUnusedIdentifiers();
  }

  sourceFile.organizeImports(
    {
      quotePreference: 'single',
      trimTrailingWhitespace: true,
      ensureNewLineAtEndOfFile: true,
      removeUnusedImports: true,
    },
    {
      quotePreference: 'single',
      trimTrailingWhitespace: true,
      ensureNewLineAtEndOfFile: true,
      importModuleSpecifierPreference: 'relative',
      importModuleSpecifierEnding: 'auto',
      allowTextChangesInNewFiles: true,
      includePackageJsonAutoImports: 'auto',
      allowRenameOfImportPath: true,
      autoImportFileExcludePatterns: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
      ],
    }
  );

  const nonRelativeImportDeclarations = sourceFile
    .getImportDeclarations()
    .filter(isNonRelativeImport);

  if (nonRelativeImportDeclarations.length > 0) {
    nonRelativeImportDeclarations.forEach((importDeclaration) => {
      const moduleSpecifier = importDeclaration.getModuleSpecifierValue();

      const moduleSpecifierRelativePath = path.relative(
        path.dirname(sourceFile.getFilePath()),
        moduleSpecifier
      );
      importDeclaration.setModuleSpecifier(moduleSpecifierRelativePath);

      console.log('converting to relative imports:', moduleSpecifier);
    });
  }

  sourceFile.saveSync();
});

project.saveSync();

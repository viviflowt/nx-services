#!/usr/bin/env node
// eslint-disable
const { Project } = require('ts-morph');
const path = require('path');
const f = require('lodash/fp');
const { dim } = require('colorette');
const fs = require('fs');

const project = new Project({
  tsConfigFilePath: path.resolve(__dirname, '../tsconfig.json'),
});

const files = process.argv.slice(2);

const outDir = path.join(process.cwd(), 'generated');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

for (const file of files) {
  const sourceFile = project.getSourceFile(file);

  if (!sourceFile) {
    console.error(`Could not find file ${file}`);
    process.exit(1);
  }

  console.info(dim(path.relative(process.cwd(), sourceFile.getFilePath())));

  [
    ...sourceFile.getFunctions(),
    ...sourceFile.getVariableDeclarations(),
    ...sourceFile.getClasses(),
    ...sourceFile.getInterfaces(),
    ...sourceFile.getEnums(),
    ...sourceFile.getTypeAliases(),
  ].forEach((node) => {
    const name = node.getName();

    if (name) {
      if (
        ['FunctionDeclaration', 'ClassDeclaration'].includes(node.getKindName())
      ) {
        console.log(f.kebabCase(name).concat('.ts'));

        fs.writeFileSync(
          path.join(outDir, f.kebabCase(name).concat('.ts')),
          node.getFullText(),
          'utf8'
        );
        // fs.writeFileSync(
        //   path.join(outDir, f.kebabCase(name).concat('.spec.ts')),
        //   `import { ${name} } from './${f.kebabCase(
        //     name,
        //   )}';\n\ndescribe('${name}', () => {\n  it('should work', () => {\n    expect(${name}()).toEqual('${name}');\n  });\n});`,
        //   'utf8',
        // );
      }

      if (
        [
          'InterfaceDeclaration',
          'EnumDeclaration',
          'TypeAliasDeclaration',
        ].includes(node.getKindName())
      ) {
        if (node.getKindName() === 'TypeAliasDeclaration') {
          console.log(f.kebabCase(name).concat('.d.ts'));

          fs.writeFileSync(
            path.join(outDir, f.kebabCase(name).concat('.ts')),
            node.getFullText()
          );
        }

        if (node.getKindName() === 'EnumDeclaration') {
          console.log(f.kebabCase(name).concat('.enum.ts'));
          fs.writeFileSync(
            path.join(outDir, f.kebabCase(name).concat('.enum.ts')),
            node.getFullText()
          );
        }

        if (node.getKindName() === 'InterfaceDeclaration') {
          console.log(f.kebabCase(name).concat('.interface.ts'));

          fs.writeFileSync(
            path.join(outDir, f.kebabCase(name).concat('.interface.ts')),
            node.getFullText()
          );
        }
      }
    }
  });
}

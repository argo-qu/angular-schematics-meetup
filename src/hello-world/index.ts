import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function helloWorld(_options: any): Rule {
  console.log('Options: ');
  console.log(JSON.stringify(_options, null, 2));

  return (tree: Tree, _context: SchematicContext) => {
    tree.create('./output/hello.js', `console.log('hello, ${_options.name}!');`);
    tree.rename('./output/hello.js', './output/hello-world.js');
    tree.create('./output/tmp.js', `;;;;`);
    tree.rename('./output/tmp.js', './not-an-output/tmp.js');
    tree.delete('./not-an-output/tmp.js');

    return tree;
  };
}

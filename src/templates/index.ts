import {apply, applyTemplates, chain, mergeWith, move, Rule, Tree, url} from '@angular-devkit/schematics';

import {normalize, strings} from '@angular-devkit/core';
import {Schema} from './schema';
import {createHost, getAngularProject, updateOptionsByProjectSettings} from './schema-helpers';

export function templates(_options: Schema): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);
    const project = await getAngularProject(_options, host);
    const options: Schema = updateOptionsByProjectSettings(_options, project);

    const templateSource = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        name: options.name
      }),
      move(normalize(options.path as string))
    ]);

    return chain([
      mergeWith(templateSource)
    ]);
  };
}

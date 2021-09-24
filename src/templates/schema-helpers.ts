import {SchematicsException, Tree} from '@angular-devkit/schematics';
import {virtualFs, workspaces} from '@angular-devkit/core';
import {Schema} from './schema';
import {ProjectDefinition} from '@angular-devkit/core/src/workspace/definitions';

// Создание WorkspaceHost. Нужно, чтобы считать Angular Workspace (angular.json)
export const createHost = (tree: Tree): workspaces.WorkspaceHost => {
  return {
    async readFile(path: string): Promise<string> {
      const data = tree.read(path);
      if (!data) {
        throw new SchematicsException('File not found.');
      }
      return virtualFs.fileBufferToString(data);
    },
    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },
    async isDirectory(path: string): Promise<boolean> {
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    },
  };
}

// Получаем данные из angular.json
export const getAngularProject = async  (options: Schema, host: workspaces.WorkspaceHost): Promise<ProjectDefinition> => {
  const { workspace } = await workspaces.readWorkspace('/', host);

  if (!options.project) {
    options.project = workspace.extensions.defaultProject as string;
  }

  const project: ProjectDefinition | undefined = workspace.projects.get(options.project as string);
  if (!project) {
    throw new SchematicsException(`Invalid project name: ${options.project}`);
  }

  return project;
}

// Обновляем path в options таким образом, чтобы новые файлы появлялись внутри sourceRoot (<project>/app/src/)
export const updateOptionsByProjectSettings = (options: Schema, project: ProjectDefinition): Schema => {
  const projectType = project.extensions.projectType === 'application' ? 'app' : 'lib';

  if (options.path === undefined) {
    return {
      ...options,
      path: `${project.sourceRoot}/${projectType}`
    };
  }

  return options;
}

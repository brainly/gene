type ServiceType = 'apollo' | 'react-query';
type CrudFunction = 'get' | 'create' | 'update' | 'delete';

export interface BrainlyServiceGenerator {
  name: string;
  directory: string;
  tags: string;
  serviceType: ServiceType;
  useDefaultCrudFunctions?: boolean;
  crudOperations?: string[];
  includeRead?: boolean;
  includeCreate?: boolean;
  includeUpdate?: boolean;
  includeDelete?: boolean;
}

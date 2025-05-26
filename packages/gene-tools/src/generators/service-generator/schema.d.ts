type ServiceType = 'apollo' | 'react-query';
type CrudFunction = 'list' | 'get' | 'create' | 'update' | 'delete';

export interface BrainlyServiceGenerator {
  name: string;
  directory: string;
  tags: string;
  serviceType: ServiceType;
  includeList?: boolean;
  includeRead?: boolean;
  includeCreate?: boolean;
  includeUpdate?: boolean;
  includeDelete?: boolean;
}

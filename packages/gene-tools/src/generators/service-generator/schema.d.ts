type ServiceType = 'apollo' | 'react-query';

export interface BrainlyServiceGenerator {
  name: string;
  directory: string;
  library: string;
  tags: string;
  serviceType: ServiceType;
  useDefaultCrudFunctions?: boolean;
}

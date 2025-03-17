type ServiceType = 'apollo' | 'react-query';

export interface BrainlyServiceGenerator {
  name: string;
  directory: string;
  tags: string;
  serviceType: ServiceType;
  useDefaultCrudFunctions?: boolean;
}

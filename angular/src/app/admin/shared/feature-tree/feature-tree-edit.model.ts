import { FlatFeatureDto, NameValueDto } from '@shared/service-proxies/service-proxies';

export interface FeatureTreeEditModel {

    features: FlatFeatureDto[];

    featureValues: NameValueDto[];

}

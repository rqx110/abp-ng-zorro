import { Component, Injector } from '@angular/core';
import { FeatureTreeEditModel } from '@app/admin/shared/feature-tree/feature-tree-edit.model';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FlatFeatureDto, NameValueDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { NzTreeNode } from 'ng-zorro-antd';
import { ArrayService } from '@delon/util';

@Component({
    selector: 'feature-tree',
    templateUrl: './feature-tree.component.html',
    styleUrls: ['./feature-tree.component.less']
})
export class FeatureTreeComponent extends AppComponentBase {
    _editData: FeatureTreeEditModel;

    set editData(val: FeatureTreeEditModel) {
        this._editData = val;
        this.setTreeData(val.features);
    }

    treeData: NzTreeNode[] = [];

    selectedFeatures: FlatFeatureDto[] = [];

    constructor(
        private _arrayService: ArrayService,
        injector: Injector
    ) {
        super(injector);
    }

    setTreeData(features: FlatFeatureDto[]) {
        this.treeData = this._arrayService.arrToTreeNode(
            features,
            {
                idMapName: 'name',
                parentIdMapName: 'parentName',
                titleMapName: 'displayName',
                cb: (item: any) => {
                    item.disableCheckbox = item.inputType.name !== 'CHECKBOX';
                    this.setSelectedNodes(item);
                }
            }
        );
    }

    setSelectedNodes(feature: FlatFeatureDto) {
        let featureValues = _.filter(this._editData.featureValues, { name: feature.name });
        if (featureValues && featureValues.length === 1) {
            let featureValue = featureValues[0];
            this.setSelectedNode(feature, featureValue.value);
        } else {
            this.setSelectedNode(feature, feature.defaultValue);
        }
    }

    setSelectedNode(feature, value) {
        if (value === 'true') {
            feature.checked = true;
        } else if (value && value !== 'false') {
            feature['value'] = value;
        }
        this.selectedFeatures.push(feature);
    }

    getGrantedFeatures(): NameValueDto[] {

        if (!this._editData.features) {
            return [];
        }

        let features: NameValueDto[] = [];

        this.selectedFeatures.map((feature: any) => {

            let featureValue = this.getFeatureValue(feature);

            features.push(new NameValueDto({ name: feature.name, value: featureValue }));
        });

        return features;
    }

    isFeatureValueValid(feature: FlatFeatureDto, value: string): boolean {

        if (!feature.inputType || !feature.inputType.validator) {
            return true;
        }

        const validator = (feature.inputType.validator as any);
        if (validator.name === 'STRING') {
            if (value === undefined || value === null) {
                return validator.allowNull;
            }

            if (typeof value !== 'string') {
                return false;
            }

            if (validator.minLength > 0 && value.length < validator.minLength) {
                return false;
            }

            if (validator.maxLength > 0 && value.length > validator.maxLength) {
                return false;
            }

            if (validator.regularExpression) {
                return (new RegExp(validator.regularExpression)).test(value);
            }
        } else if (validator.name === 'NUMERIC') {
            const numValue = parseInt(value);

            if (isNaN(numValue)) {
                return false;
            }

            const minValue = validator.minValue;
            if (minValue > numValue) {
                return false;
            }

            const maxValue = validator.maxValue;
            if (maxValue > 0 && numValue > maxValue) {
                return false;
            }
        }

        return true;
    }

    areAllValuesValid(): boolean {

        let result = true;

        _.forEach(this.selectedFeatures, feature => {
            let value = this.getFeatureValue(feature);
            if (!this.isFeatureValueValid(feature, value)) {
                result = false;
            }
        });

        return result;
    }

    getFeatureValue(feature: any): string {

        if (feature.value) {
            return feature.value;
        }

        if (!feature.checked) {
            return 'false';
        }
        return 'true';
    }
}

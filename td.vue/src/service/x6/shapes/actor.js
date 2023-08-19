import { Shape } from '@antv/x6';

import { tc } from '@/i18n/index.js';

const name = 'actor';

// actor (rectangle, white background)
export const ActorShape = Shape.Rect.define({
    constructorName: name,
    height: 80,
    width: 150,
    zIndex: 0,
    label: tc('threatmodel.shapes.actor'),
    attrs: {
        body: {
            magnet: false // needs to be disabled to grab whole shape
        }
    }
});

ActorShape.prototype.type = 'tm.Actor';

ActorShape.prototype.setName = function (name) {
    this.label = name;
};

ActorShape.prototype.updateStyle = function (color, dash, strokeWidth) {
    this.setAttrByPath('body/stroke', color);
    this.setAttrByPath('body/strokeWidth', strokeWidth);
    this.setAttrByPath('body/strokeDasharray', dash);
};

export default {
    name,
    ActorShape
};

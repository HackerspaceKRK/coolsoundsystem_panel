// Dirty patch on switches

MQTTControlCheckbox.prototype.bind = function() {
        this.elem.on('change', function(){
                this.onUiChangeValue(this.elem.prop('checked') ? '0' : '1');
        }.bind(this));
}
MQTTControlCheckbox.prototype.uiSet = function(val) {
        this.elem.prop('checked', val == '0');
        this.elem.flipswitch('refresh');
};

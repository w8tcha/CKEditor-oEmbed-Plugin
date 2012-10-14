/*
* oEmbed Plugin plugin
* Copyright (c) Ingo Herbote
* Licensed under the MIT license
* jQuery Embed Plugin Embeds: http://code.google.com/p/jquery-oembed/ (MIT License)
* Plugin for: http://ckeditor.com/license (GPL/LGPL/MPL: http://ckeditor.com/license)
*/

(function () {
    CKEDITOR.dialog.add('oEmbed', function (editor) {
        return {
            title: editor.lang.oEmbed.title,
            minWidth: CKEDITOR.env.ie && CKEDITOR.env.quirks ? 568 : 550,
            minHeight: 240,
            onShow: function () {
				 CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(CKEDITOR.plugins.getPath('oEmbed') + 'dialogs/jquery.oembed.js'));
            },
            onOk: function () {
                inputCode = this.getValueOf('general', 'embedCode'); //this.getContentElement('general', 'content').getInputElement().getValue();
                var width = 560;
                var height = 315;

                width = this.getContentElement('general', 'width').getInputElement().getValue();
                height = this.getContentElement('general', 'height').getInputElement().getValue();
				
				
				var editorInstance = this.getParentEditor();
				
				if (inputCode.length > 1 && inputCode.indexOf('http') > -1) {
					$('body').oembed(inputCode, {
                        afterEmbed: function (e) {
							//console.log(e.provider.name + ' ' + e.provider.type + editor.lang.oEmbed.found);
							editorInstance.insertHtml(e.code);
                        },
                        
                        maxHeight: height,
                        maxWidth: width,
						embedMethod: 'editor'
                    });
                }
            },
            contents: [{
                label: editor.lang.common.generalTab,
                id: 'general',
                elements: [{
                    type: 'html',
                    id: 'youtubeHeader',
                    html: '<div style="white-space:normal;width:500px;font-size:large;">' + editor.lang.oEmbed.pasteUrl + '</div>'
                }, {
                    type: 'textarea',
                    id: 'embedCode',
                    style: 'height:80px',
                    focus: function () {
                        this.getElement().focus()
                    }
                }, {
                    type: 'hbox',
                    widths: ['50%', '50%'],
                    children: [{
                        type: 'text',
                        id: 'width',
                        'default': '560',
                        label: editor.lang.oEmbed.width
                    }, {
                        type: 'text',
                        id: 'height',
                        'default': '315',
                        label: editor.lang.oEmbed.height
                    }]
                }]
            }]
        }
    })
})();

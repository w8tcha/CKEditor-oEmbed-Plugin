/*
* oEmbed Plugin plugin
* Copyright (c) Ingo Herbote
* Licensed under the MIT license
* jQuery Embed Plugin: http://code.google.com/p/jquery-oembed/ (MIT License)
* Plugin for: http://ckeditor.com/license (GPL/LGPL/MPL: http://ckeditor.com/license)
*/

(function() {
    CKEDITOR.plugins.add('oembed', {
        requires: ['dialog'],
        lang: ['de', 'en', 'nl', 'fr', 'ru'],
        init: function(editor) {
            // Load jquery?
            if (typeof(jQuery) == 'undefined') {
                CKEDITOR.scriptLoader.load('http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js', function() {
                    if (typeof(jQuery.fn.oembed) == 'undefined') {
                        CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(CKEDITOR.plugins.getPath('oembed') + 'libs/jquery.oembed.min.js'));
                    }
                });

            } else if (typeof(jQuery.fn.oembed) == 'undefined') {
                CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(CKEDITOR.plugins.getPath('oembed') + 'libs/jquery.oembed.min.js'));
            }

            editor.addCommand('oembed', new CKEDITOR.dialogCommand('oembed'));
            editor.ui.addButton('oembed', {
                label: editor.lang.oembed.button,
                command: 'oembed',
                icon: this.path + 'images/icon.png'
            });
            CKEDITOR.dialog.add('oembed', function(editor) {
                return {
                    title: editor.lang.oembed.title,
                    minWidth: CKEDITOR.env.ie && CKEDITOR.env.quirks ? 568 : 550,
                    minHeight: 240,
                    onOk: function() {
                        var inputCode = this.getValueOf('general', 'embedCode').replace('https:', 'http:');
                        if (inputCode.length < 1 || inputCode.indexOf('http') < 0) {
                            alert(editor.lang.oembed.invalidUrl);
                            return false;
                        }
                        var width = this.getContentElement('general', 'width').getInputElement().getValue();
                        var height = this.getContentElement('general', 'height').getInputElement().getValue();
                        var editorInstance = this.getParentEditor();
                        $('body').oembed(inputCode, {
                            onEmbed: function(e) {
                                if (typeof e.code === 'string') {
                                    editorInstance.insertElement(CKEDITOR.dom.element.createFromHtml((editor.config.oembed_WrapperClass != null ? '<div class="' + editor.config.oembed_WrapperClass + '">' : '<div>') + e.code + '</div>'));
                                    CKEDITOR.dialog.getCurrent().hide();
                                } else {
                                    alert(editor.lang.oembed.noEmbedCode);
                                }
                            },
                            maxHeight: height,
                            maxWidth: width,
                            embedMethod: 'editor'
                        });
                        return false;
                    },
                    contents: [{
                        label: editor.lang.common.generalTab,
                        id: 'general',
                        elements: [{
                                type: 'html',
                                id: 'oembedHeader',
                                html: '<div style="white-space:normal;width:500px;padding-bottom:10px">' + editor.lang.oembed.pasteUrl + '</div>'
                            }, {
                                type: 'textarea',
                                id: 'embedCode',
                                height: "80",
                                focus: function() {
                                    this.getElement().focus();
                                }
                            }, {
                                type: 'hbox',
                                widths: ['50%', '50%'],
                                children: [{
                                        type: 'text',
                                        id: 'width',
                                        'default': editor.config.oembed_maxWidth != null ? editor.config.oembed_maxWidth : '560',
                                        label: editor.lang.oembed.width
                                    }, {
                                        type: 'text',
                                        id: 'height',
                                        'default': editor.config.oembed_maxHeight != null ? editor.config.oembed_maxHeight : '315',
                                        label: editor.lang.oembed.height
                                    }]
                            }]
                    }]
                };
            });
        }
    });
})();
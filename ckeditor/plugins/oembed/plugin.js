/*
* oEmbed Plugin plugin
* Copyright (c) Ingo Herbote
* Licensed under the MIT license
* jQuery Embed Plugin: http://code.google.com/p/jquery-oembed/ (MIT License)
* Plugin for: http://ckeditor.com/license (GPL/LGPL/MPL: http://ckeditor.com/license)
*/

(function () {
    CKEDITOR.plugins.add('oembed', {
        requires: ['dialog'],
        lang: ['de', 'en', 'nl'],
        init: function (editor) {
            // Load jquery?
            if (typeof (jQuery) == 'undefined') {
                CKEDITOR.scriptLoader.load('http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js');
            }
            editor.addCommand('oembed', new CKEDITOR.dialogCommand('oembed'));
            editor.ui.addButton('oembed', {
                label: editor.lang.oembed.button,
                command: 'oembed',
                icon: this.path + 'images/icon.png'
            });
            CKEDITOR.dialog.add('oembed', function (editor) {
                return {
                    title: editor.lang.oembed.title,
                    minWidth: CKEDITOR.env.ie && CKEDITOR.env.quirks ? 568 : 550,
                    minHeight: 240,
                    onLoad: function () {
                        if (typeof (jQuery.fn.oembed) == 'undefined') {
                            CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(CKEDITOR.plugins.getPath('oembed') + 'libs/jquery.oembed.min.js'));
                        }
                    },
                    onCancel: function () {
                        $('#oembedInfoFooter').hide();
                    },
                    onOk: function () {
                        $('#oembedInfoFooter').hide();
                        var inputCode = this.getValueOf('general', 'embedCode');
                        if (inputCode.length < 1 || inputCode.indexOf('http') < 0) {
                            $('#oembedInfoFooter').html(editor.lang.oembed.invalidUrl);
                            $('#oembedInfoFooter').css("color", "red");
                            $('#oembedInfoFooter').show();
                            return false;
                        }
                        var width = this.getContentElement('general', 'width').getInputElement().getValue();
                        var height = this.getContentElement('general', 'height').getInputElement().getValue();
                        var editorInstance = this.getParentEditor();
                        var codeFound = null;
                        $('body').oembed(inputCode, {
                            onEmbed: function (e) {
                                if (typeof e.code === 'string') {
									editorInstance.insertElement( CKEDITOR.dom.element.createFromHtml( '<p>' + e.code + '</p>' ) );
                                    CKEDITOR.dialog.getCurrent().hide();
                                } else {
                                    //this.show();
                                    $('#oembedInfoFooter').html(editor.lang.oembed.noEmbedCode);
                                    $('#oembedInfoFooter').css("color", "red");
                                    $('#oembedInfoFooter').show();
                                }
                            },
                            maxHeight: width,
                            maxWidth: height,
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
                            html: '<div style="white-space:normal;width:500px;">' + editor.lang.oembed.pasteUrl + '</div>'
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
                                'default': editor.config.oembed_maxWidth != null ? config.oembed_maxWidth : '560',
                                label: editor.lang.oembed.width
                            }, {
                                type: 'text',
                                id: 'height',
                                'default': editor.config.oembed_maxHeight != null ? config.oembed_maxHeight : '315',
                                label: editor.lang.oembed.height
                            }]
                        }, {
                            type: 'html',
                            id: 'oembedInfoFooter',
                            html: '<div id="oembedInfoFooter" style="white-space:normal;width:500px;text-align:center;display:none"></div>'
                        }]
                    }]
                }
            })
        }
    })
})();
/**
* oEmbed Plugin plugin
* Licensed under the MIT license
* jQuery Embed Plugin: http://code.google.com/p/jquery-oembed/ (MIT License)
* Plugin for: http://ckeditor.com/license (GPL/LGPL/MPL: http://ckeditor.com/license)
*/

(function () {
    CKEDITOR.plugins.add('oembed', {
        icons: 'oembed',
        hidpi: true,
        requires: 'widget,dialog',
        lang: 'de,en,fr,nl,pl,pt-br,ru,tr', // %REMOVE_LINE_CORE%
        version: 1.14,
        init: function (editor) {
            // Load jquery?
            loadjQueryLibaries();

            CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
                oEmbed: function (url, maxWidth, maxHeight, responsiveResize) {

                    if (url.length < 1 || url.indexOf('http') < 0) {
                        alert(editor.lang.oembed.invalidUrl);
                        return false;
                    }
                    
                    function embed() {
                        if (maxWidth == null || maxWidth == 'undefined') {
                            maxWidth = null;
                        }

                        if (maxHeight == null || maxHeight == 'undefined') {
                            maxHeight = null;
                        }

                        if (responsiveResize == null || responsiveResize == 'undefined') {
                            responsiveResize = false;
                        }

                        embedCode(url, editor, false, maxWidth, maxHeight, responsiveResize);
                    }

                    if (typeof(jQuery.fn.oembed) === 'undefined') {
                        CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(CKEDITOR.plugins.getPath('oembed') + 'libs/jquery.oembed.min.js'), function() {
                            embed();
                        });
                    } else {
                        embed();
                    }

                    return true;
                }
            });


            editor.widgets.add('oembed', {
                draggable: true,
                mask: true,
                dialog: 'oembed',
                //button: editor.lang.oembed.button,
                allowedContent: 'div(!' + (editor.config.oembed_WrapperClass != null ? editor.config.oembed_WrapperClass : "embeddedContent") + ');div iframe[*]',
                template:
                    '<div class="' + (editor.config.oembed_WrapperClass != null ? editor.config.oembed_WrapperClass : "embeddedContent") +  '">' +
                        '</div>',
                upcast: function (element) {
                    return element.name == 'div' && element.hasClass(editor.config.oembed_WrapperClass != null ? editor.config.oembed_WrapperClass : "embeddedContent");
                },
                init: function () {
                    var data = {
                        oembed: this.element.data('oembed') || '',
						resizeType : this.element.data('resizeType') || '',
						maxWidth : this.element.data('maxWidth') || 560,
						maxHeight : this.element.data('maxHeight') || 315
                        };

                    this.setData(data);

                    this.on('dialog', function (evt) {
                        evt.data.widget = this;
                    }, this);
                }
            });
            
            editor.ui.addButton('oembed', {
                label: editor.lang.oembed.button,
                command: 'oembed',
                toolbar: 'insert,10',
                icon: this.path + "icons/" + (CKEDITOR.env.hidpi ? "hidpi/" : "") + "oembed.png"
            });

            var resizeTypeChanged = function () {
                var dialog = this.getDialog(),
                    resizetype = this.getValue(),
                    maxSizeBox = dialog.getContentElement('general', 'maxSizeBox').getElement(),
                    sizeBox = dialog.getContentElement('general', 'sizeBox').getElement();

                if (resizetype == 'noresize') {
                    maxSizeBox.hide();

                    sizeBox.hide();
                } else if (resizetype == "custom") {
                    maxSizeBox.hide();

                    sizeBox.show();
                } else {
                    maxSizeBox.show();

                    sizeBox.hide();
                }

            };

            String.prototype.beginsWith = function(string) {
                return (this.indexOf(string) === 0);
            };

            function loadjQueryLibaries() {
                if (typeof(jQuery) === 'undefined') {
                    CKEDITOR.scriptLoader.load('http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js', function() {
                        jQuery.noConflict();
                        if (typeof(jQuery.fn.oembed) === 'undefined') {
                            CKEDITOR.scriptLoader.load(
                                CKEDITOR.getUrl(CKEDITOR.plugins.getPath('oembed') + 'libs/jquery.oembed.min.js')
                            );
                        }
                    });

                } else if (typeof(jQuery.fn.oembed) === 'undefined') {
                    CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(CKEDITOR.plugins.getPath('oembed') + 'libs/jquery.oembed.min.js'));
                }
            }

            function embedCode(url, instance, closeDialog, maxWidth, maxHeight, responsiveResize, resizeType, widget) {
                jQuery('body').oembed(url, {
                    onEmbed: function(e) {
                        var elementAdded = false;
						
						widget.element.data('resizeType', resizeType);
						if(resizeType == "responsive" || resizeType == "custom")
						{
							widget.element.data('maxWidth', maxWidth);
							widget.element.data('maxHeight', maxHeight);
						}
						
                        if (typeof e.code === 'string') {
                            if (widget.element.$.firstChild) {
                                widget.element.$.removeChild(widget.element.$.firstChild);
                            }

                            widget.element.appendHtml(e.code);
                            widget.element.data('oembed', url);

                            elementAdded = true;
                        } else if (typeof e.code[0].outerHTML === 'string') {

                            if (widget.element.$.firstChild) {
                                widget.element.$.removeChild(widget.element.$.firstChild);
                            }

                            widget.element.appendHtml(e.code[0].outerHTML);
                            widget.element.data('oembed', url);

                            elementAdded = true;
                        } else {
                            alert(editor.lang.oembed.noEmbedCode);
                        }
                        
                        if (elementAdded) {
                            if (closeDialog) {
                                CKEDITOR.dialog.getCurrent().hide();
                            }
                        }
                    },
                    onError: function(externalUrl) {
                        if (externalUrl.indexOf("vimeo.com") > 0) {
                            alert(editor.lang.oembed.noVimeo);
                        } else {
                            alert(editor.lang.oembed.Error);
                        }

                    },
                    maxHeight: maxHeight,
                    maxWidth: maxWidth,
                    useResponsiveResize: responsiveResize,
                    embedMethod: 'editor'
                });
            }

            CKEDITOR.dialog.add('oembed', function(editor) {
                return {
                    title: editor.lang.oembed.title,
                    minWidth: CKEDITOR.env.ie && CKEDITOR.env.quirks ? 568 : 550,
                    minHeight: 155,
                    onShow: function() {
						var data = {
							oembed: this.widget.element.data('oembed') || '',
							resizeType : this.widget.element.data('resizeType') || '',
							maxWidth : this.widget.element.data('maxWidth') || 560,
							maxHeight : this.widget.element.data('maxHeight') || 315
							};

						this.widget.setData(data);
						
						this.getContentElement('general', 'resizeType').setValue(data.resizeType);
						
                        var resizetype = this.getContentElement('general', 'resizeType').getValue(),
                            maxSizeBox = this.getContentElement('general', 'maxSizeBox').getElement(),
                            sizeBox = this.getContentElement('general', 'sizeBox').getElement();
							
                        if (resizetype == 'noresize') {
                            maxSizeBox.hide();
                            sizeBox.hide();
                        } else if (resizetype == "custom") {
                            maxSizeBox.hide();

                            sizeBox.show();
                        } else {
                            maxSizeBox.show();

                            sizeBox.hide();
                        }
                    },

                    onOk: function() {
                    },
                    contents: [{
                        label: editor.lang.common.generalTab,
                        id: 'general',
                        elements: [{
                                type: 'html',
                                id: 'oembedHeader',
                                html: '<div style="white-space:normal;width:500px;padding-bottom:10px">' + editor.lang.oembed.pasteUrl + '</div>'
                            }, {
                                type: 'text',
                                id: 'embedCode',
                                focus: function() {
                                    this.getElement().focus();
                                },
                                label: editor.lang.oembed.url,
                                title: editor.lang.oembed.pasteUrl,
                                setup: function(widget) {
                                    if (widget.data.oembed) {
                                       this.setValue(widget.data.oembed);
                                    }
                                },
                                commit: function(widget) {
                                    var dialog = CKEDITOR.dialog.getCurrent(),
                                        inputCode = dialog.getValueOf('general', 'embedCode').replace(/\s/g, ""),
                                        resizeType = dialog.getContentElement('general', 'resizeType').
                                            getValue(),
                                        maxWidth = null,
                                        maxHeight = null,
                                        responsiveResize = false,
                                        editorInstance = dialog.getParentEditor(),
                                        closeDialog = dialog.getContentElement('general', 'autoCloseDialog').
                                            getValue();

                                    if (inputCode.length < 1 || inputCode.indexOf('http') < 0) {
                                        alert(editor.lang.oembed.invalidUrl);
                                        return false;
                                    }

                                    if (resizeType == "noresize") {
                                        responsiveResize = false;
                                    } else {
                                        if (resizeType == "responsive") {
                                            maxWidth = dialog.getContentElement('general', 'maxWidth').
                                                getInputElement().
                                                getValue();
                                            maxHeight = dialog.getContentElement('general', 'maxHeight').
                                                getInputElement().
                                                getValue();

                                            responsiveResize = true;
                                        } else if (resizeType == "custom") {
                                            maxWidth = dialog.getContentElement('general', 'width').
                                                getInputElement().
                                                getValue();
                                            maxHeight = dialog.getContentElement('general', 'height').
                                                getInputElement().
                                                getValue();

                                            responsiveResize = false;
                                        }
                                    }

                                    embedCode(inputCode, editorInstance, closeDialog, maxWidth, maxHeight, responsiveResize, resizeType, widget);

                                    widget.setData('oembed', inputCode);
                                    widget.setData('resizeType', resizeType);
                                    widget.setData('maxWidth', maxWidth);
                                    widget.setData('maxHeight', maxHeight);
                                }
                            }, {
                                type: 'hbox',
                                widths: ['50%', '50%'],
                                children: [{
                                        id: 'resizeType',
                                        type: 'select',
                                        label: editor.lang.oembed.resizeType,
                                        'default': 'noresize',
										setup: function(widget) {
											if (widget.data.resizeType) {
											   this.setValue(widget.data.resizeType);
											}
										},
                                        items: [
                                            [editor.lang.oembed.noresize, 'noresize'],
                                            [editor.lang.oembed.responsive, 'responsive'],
                                            [editor.lang.oembed.custom, 'custom']
                                        ],
                                        onChange: resizeTypeChanged
                                    }, {
                                        type: 'hbox',
                                        id: 'maxSizeBox',
                                        widths: ['120px', '120px'],
                                        style: 'float:left;position:absolute;left:58%;width:200px',
                                        children: [{
                                                type: 'text',
                                                width: '100px',
                                                id: 'maxWidth',
                                                'default': editor.config.oembed_maxWidth != null ? editor.config.oembed_maxWidth : '560',
                                                label: editor.lang.oembed.maxWidth,
                                                title: editor.lang.oembed.maxWidthTitle,
												setup: function(widget) {
													if (widget.data.maxWidth) {
														this.setValue(widget.data.maxWidth);
													}
												}
                                            }, {
                                                type: 'text',
                                                id: 'maxHeight',
                                                width: '120px',
                                                'default': editor.config.oembed_maxHeight != null ? editor.config.oembed_maxHeight : '315',
                                                label: editor.lang.oembed.maxHeight,
                                                title: editor.lang.oembed.maxHeightTitle,
												setup: function(widget) {
													if (widget.data.maxHeight) {
														this.setValue(widget.data.maxHeight);
													}
												}
                                            }]
                                    }, {
                                        type: 'hbox',
                                        id: 'sizeBox',
                                        widths: ['120px', '120px'],
                                        style: 'float:left;position:absolute;left:58%;width:200px',
                                        children: [{
                                                type: 'text',
                                                id: 'width',
                                                width: '100px',
                                                'default': editor.config.oembed_maxWidth != null ? editor.config.oembed_maxWidth : '560',
                                                label: editor.lang.oembed.width,
                                                title: editor.lang.oembed.widthTitle,
												setup: function(widget) {
													if (widget.data.maxWidth) {
													   this.setValue(widget.data.maxWidth);
													}
												}
                                            }, {
                                                type: 'text',
                                                id: 'height',
                                                width: '120px',
                                                'default': editor.config.oembed_maxHeight != null ? editor.config.oembed_maxHeight : '315',
                                                label: editor.lang.oembed.height,
                                                title: editor.lang.oembed.heightTitle,
												setup: function(widget) {
													if (widget.data.maxHeight) {
													   this.setValue(widget.data.maxHeight);
													}
												}
                                            }]
                                    }]
                            }, {
                                type: 'checkbox',
                                id: 'autoCloseDialog',
                                'default': 'checked',
                                label: editor.lang.oembed.autoClose,
                                title: editor.lang.oembed.autoClose
                            }]
                    }]
                };
            });
        }//
    });

}
)();
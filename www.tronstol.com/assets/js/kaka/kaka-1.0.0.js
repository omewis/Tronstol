kaka = function() {
    var self = this;
    self.init = function(container) {
        self.bindPlugin(container);
        $('[data-toggle=tooltip]').mouseover(function() {
            $(this).tooltip('show');
        });
    }
    self.bindPlugin = function(container) {
        $('[data-plugin]', container).each(function(idx) {
            var el = $(this);
            var data = $(this).data();
            var fa = data.plugin.match(/\-(\w)/g);
            if (fa) {
                for (x in fa) {
                    var funcName = data.plugin.replace(fa[x], fa[x].toUpperCase()).replace('-', '');
                }
            } else {
                var funcName = data.plugin;
            }
            var func = eval('self.' + funcName);
            if (func) {
                func(el, data);
            }
        });
        $('[data-selected]').each(function(idx) {
            var v = $(this).data('selected');
            $('option', this).each(function() {
                if ($(this).val() == v) {
                    $(this).prop('selected', 1);
                }
            })
        });
    }
    self.validator = function(el, opts) {
        seajs.use(['/assets/js/kaka/libs/kaka.validator.js'],
            function() {
                new kakaValidator(el, opts);
            });
    }
    self.datetimePicker = function(el, opts) {
        $(el).data('type', 'datetime');
        self.datePicker(el, opts);
    }
    self.datePicker = function(el, opts) {
        seajs.use(['/assets/js/kaka/libs/datetime/bootstrap-datetimepicker.min.js', '/assets/js/kaka/libs/datetime/css/bootstrap-datetimepicker.min.css'],
            function() {
                seajs.use(['/assets/js/kaka/libs/datetime/locales/bootstrap-datetimepicker.zh-CN.js'],
                    function() {
                        var defaults = {
                            format: 'yyyy/mm/dd',
                            language: 'zh-CN',
                            weekStart: 1,
                            todayBtn: 1,
                            autoclose: 1,
                            minView: 2,
                            todayHighlight: 1,
                            startView: 2,
                            forceParse: 0,
                            showMeridian: 0
                        };
                        opts = $.extend(true, defaults, opts);
                        switch (opts.type) {
                            case 'datetime':
                                opts.format = 'yyyy/mm/dd hh:ii';
                                opts.minView = 0;
                                opts.minuteStep = 5;
                                break;
                            case 'datehour':
                                opts.format = 'yyyy/mm/dd hh:00';
                                opts.minView = 1;
                                break;
                        }
                        $(el).datetimepicker(opts);
                    });
            });
    }
    self.chkGroup = function(el, opts) {
        $('[role=chk-all]', el).unbind('click');
        $('[role=chk-all]', el).bind('click',
            function() {
                var chk = $(this).is(":checked") ? true: false;
                $('[role=chk-item]', el).prop('checked', chk);
            });
        $('[role=chk-item]', el).unbind('click');
        $('[role=chk-item]', el).bind('click',
            function() {
                var chk = true;
                $('[role=chk-item]', el).each(function() {
                    if (!$(this).is(":checked")) chk = false;
                });
                $('[role=chk-all]', el).prop('checked', chk);
            });
    }
    // self.editor = function(el, opts) {
    //     seajs.use(['/assets/js/kaka/libs/kindeditor/kindeditor-all-min.js'],
    //         function(editor) {
    //             var defaults = {
    //                 uploadJson: '/misc.php?act=upload&token=' + opts.token,
    //                 filterMode: false,
    //                 themeType: 'bootstrap',
    //                 cssPath: '/assets/css/richtext.css',
    //                 bodyClass: 'richtext',
    //                 newlineTag: 'br',
    //                 width: '100%',
    //                 minWidth: 450,
    //                 minHeight: 400,
    //                 fontSizeTable: ['9px', '10px', '12px', '14px', '16px', '18px', '24px', '32px', '38px', '42px'],
    //                 items: ['formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage', 'flash', 'media', 'insertfile', 'table', 'baidumap', 'pagebreak', 'anchor', 'link', 'unlink', '/', 'cut', 'copy', 'paste', 'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript', 'superscript', '|', 'clearhtml', 'quickformat', 'preview', 'print', 'template', 'code', 'source', 'fullscreen', ],
    //                 afterBlur: function() {
    //                     this.sync();
    //                 }
    //             }
    //             opts = $.extend(true, defaults, opts);
    //             return KindEditor.create(el, opts);
    //         });
    // }

    // self.editor=function(el,opts){
    //     var tpl='<script id="container" name="content" type="text/plain">'
    //             +'11111'+' </script>  <script type="text/javascript"> var ue=UE.getEditor('container'); </script>';
    // }
    self.codeEditor = function(el, opts) {
        var mode = $(el).data('mode');
        el.hide();
        seajs.use(['/assets/js/kaka/libs/ace/ace.sea.js'],
            function(ace) {
                var domId = 'ace-' + $(el).index();
                var editorDom = '<div class="ace-editor-wrap" style="height:400px"><div class="form-control" id="' + domId + '" style="height:100%; font-size:13px"></div></div>';
                $(editorDom).insertAfter(el);
                var editor = ace.edit(domId);
                editor.getSession().setValue($(el).val());
                editor.getSession().setMode('ace/mode/' + mode);
                editor.getSession().on('change',
                    function(e) {
                        var val = editor.getSession().getValue();
                        $(el).val(val);
                    });
                editor.commands.addCommand({
                    name: "fullscreen",
                    bindKey: {
                        win: "Ctrl-Enter",
                        mac: "Command-Enter"
                    },
                    exec: function(editor) {
                        var vp = $('body');
                        var div = $(el).siblings('.ace-editor-wrap');
                        if (editor.isFullScreen) {
                            div.css('position', 'static');
                            div.css('height', '360px');
                            div.css('z-index', '1');
                            editor.resize();
                            editor.isFullScreen = false;
                        } else {
                            div.css('position', 'fixed');
                            div.css('left', '0px');
                            div.css('right', '0px');
                            div.css('top', '0px');
                            div.css('bottom', '0px');
                            div.css('height', 'auto');
                            div.css('z-index', '9999999');
                            editor.resize();
                            editor.isFullScreen = true;
                        }
                    }
                });
            });
    }
    self.resourceSelector = function(el, opts) {
        var id = 'resource-selector';
        var limit = $(el).data('limit');
        var idx = $(el).index();
        var ipt = $(el).data('ipt');
        var ref = $(el).data('ref') ? $(el).data('ref') : 0;
        var dom = $('[data-ipt="' + ipt + '"]>.sui-selector-box');
        var url = '/?module=admincp&controller=content&action=selector&ipt=' + ipt + '&ref=' + ref + '&limit=' + limit + '&idx=' + idx;
        var val = $('[data-ipt="' + ipt + '"]>.sui-selector-value').html();
        var files = new Array();
        $.applyResource = function(files, ipt, DOM) {
            if (typeof files == 'string') {
                var files = [{
                    id: 0,
                    src: files,
                    alt: ''
                }];
            }
            $(DOM).empty();
            for (x in files) {
                var file = files[x];
                var tpl = '<div class="js-item img-item" data-id="' + file.id + '" data-thumb="' + file.thumb + '" data-title="' + file.title + '" data-summary="' + file.summary + '">' + '<div class="box">' + '<input type="hidden" name="' + ipt + '[' + x + '][id]" value="' + file.id + '">' + '<input type="hidden" name="' + ipt + '[' + x + '][thumb]" value="' + file.thumb + '">' + '<input type="hidden" name="' + ipt + '[' + x + '][title]" value="' + file.title + '">' + '<input type="hidden" name="' + ipt + '[' + x + '][summary]" value="' + file.summary + '">' + '<a class="thumb" title="' + (file.title ? file.title: '') + '">' + (file.thumb ? '<img src="' + file.thumb + '">': file.title) + '</a>' + '<div class="title cutstr">' + (file.title) + '</div>' + '<div class="summary">' + (file.summary) + '</div>' + '<div class="operate">' + '<a href="javascript:;" class="js-del-item">' + '<i class="fa fa-remove"></i> 移除</a>' + '</div></div></div>';
                $(DOM).append(tpl);
            }
            $('.js-del-item', DOM).on('click',
                function() {
                    $(this).parents('.js-item').remove();
                });
            seajs.use(['/assets/js/kaka/libs/dragsort/jquery.dragsort-0.5.2.min.js'],
                function(dragsort) {
                    $(DOM).dragsort("destroy");
                    $(DOM).dragsort({
                        placeHolderTemplate: "<div class='img-item'></div>"
                    });
                });
        }
        if (val) {
            $.applyResource(eval('(' + val + ')'), ipt, dom);
        }
        $('[role="btn"]', el).unbind('click');
        $('[role="btn"]', el).bind('click',
            function() {
                $('#' + id).remove();
                $('body').append('<div class="modal fade" id="' + id + '" tabindex="-1" role="dialog" aria-hidden="false"></div>');
                $('#' + id).load(url,
                    function() {
                        $('#' + id).modal("show");
                        $('.btn-ok').click(function() {
                            $.applyResource(resources, ipt, dom);
                        });
                    })
            });
    }
    self.imgSelector = function(el, opts) {
        var id = 'img-selector';
        var limit = $(el).data('limit');
        var name = $(el).data('name') ? $(el).data('name') : '';  // ***
        var idx = $(el).index();
        var ipt = $(el).data('ipt');
        var ref = $(el).data('ref') ? $(el).data('ref') : 0;
        var dom = $('[data-ipt="' + ipt + '"]>.sui-selector-box');
        var url = '/?module=admincp&controller=image&action=selector&ipt=' + ipt + '&ref=' + ref + '&limit=' + limit + '&idx=' + idx + '&name=' + name;  // ***这里添了name
        var val = $('.sui-selector-value', el).html();
        var files = new Array();
        $.applyImage = function(file, ipt, DOM) {
            var tpl = '<input type="hidden" name="' + ipt + '" value="' + file + '" />' + '<a class="img-preview"><img src="' + file + '" role="btn" /></a>' + '<a class="js-del-item img-remove" href="javascript:;"><i class="fa fa-remove"></i> <span>移除</span></a>';
            $(DOM).html(tpl);
            $('.js-del-item', DOM).on('click',
                function() {
                    $(DOM).empty().html('<input type="hidden" name="' + ipt + '" value="" />');
                    event.stopPropagation();
                });
        }
        $.applyImages = function(files, ipt, DOM) {
            if (typeof files == 'string') {
                var files = [{
                    id: 0,
                    src: files,
                    alt: ''
                }];
            }
            $(DOM).empty();
             for (x in files) {
                var file = files[x];
                var tpl = '<div class="js-item img-item">' + '<div class="alt">' + '<input type="hidden" name="' + ipt + '[' + x + '][id]" value="' + file.id + '">' + '<input type="hidden" name="' + ipt + '[' + x + '][src]" value="' + file.src + '">' + '<textarea name="' + ipt + '[' + x + '][alt]" value="' + file.alt + '" rows="2" class="form-control" placeholder="请输入图片说明">' + (file.alt ? file.alt: '') + '</textarea>' + '<a href="javascript:;$(\'.alt\',\'.js-item\').hide();" class="btn btn-primary btn-xs">确定</a>' + '</div>' + '<a class="thumb" title="' + (file.alt ? file.alt: '') + '"><img src="' + file.src + '" data-id="' + file.id + '" alt="'+(file.alt ? file.alt: '')+'"></a>' + '<div class="operate">' + '<a href="javascript:;" class="js-del-item">' + '<i class="fa fa-remove"></i> 移除</a>' + '</div></div>';
                $(DOM).append(tpl);
            }
            $('.js-item', DOM).on('click',
                function() {
                    var el = $(this);
                    $('.alt', DOM).hide();
                    $('.alt', el).show();
                    $(document).mouseup(function(e) {
                        var _con = el;
                        if (!_con.is(e.target) && _con.has(e.target).length === 0) {
                            $('.alt', DOM).hide();
                        }
                    });
                    event.stopPropagation();
                    seajs.use(['/assets/js/kaka/libs/dragsort/jquery.dragsort-0.5.2.min.js'],
                        function(dragsort) {
                            $(DOM).dragsort("destroy");
                            $(DOM).dragsort({
                                placeHolderTemplate: "<div class='img-item'></div>"
                            });
                        });
                });
            $('.js-del-item', DOM).on('click',
                function() {
                    $(this).parents('.js-item').remove();
                });
        }
        if (val) {
            if (limit > 1) {
                $.applyImages(eval('(' + val + ')'), ipt, dom);
            } else {
                $.applyImage(val, ipt, dom);
            }
        }
        $('[role="btn"]', el).unbind('click');
        $('[role="btn"]', el).bind('click',
            function() {
                $('#' + id).remove();
                $('body').append('<div class="modal fade" id="' + id + '" tabindex="-1" role="dialog" aria-hidden="false"></div>');
                $('#' + id).load(url,
                    function() {
                        $('#' + id).modal("show");
                        $('.btn-ok').click(function() {
                            if (limit > 1) {
                                $.applyImages(images, ipt, dom);
                            } else {
                                $.applyImage(images[0].src, ipt, dom);
                            }
                        });
                    })
            });
    }
    self.userSelector = function(el, opts) {
        var id = 'user-selector';
        var role = $(el).data('role');
        var url = '/?module=admincp&controller=user&action=selector&role=' + role;
        $('[role="btn"]', el).unbind('click');
        $('[role="btn"]', el).bind('click',
            function() {
                $('#' + id).remove();
                $('body').append('<div class="modal fade" id="' + id + '" tabindex="-1" role="dialog" aria-hidden="false"></div>');
                $('#' + id).load(url,
                    function() {
                        $('#' + id).modal("show");
                    });
            });
    }
    self.tagsinput = function(el, opts) {
        seajs.use(['/assets/js/kaka/libs/tagsinput/bootstrap-typeahead.js', '/assets/js/kaka/libs/tagsinput/bootstrap-tagsinput.js', '/assets/js/kaka/libs/tagsinput/bootstrap-tagsinput.css'],
            function() {
                var remoteUrl = $(el).data('typeahead');
                if (remoteUrl) {
                    $(el).tagsinput({
                        typeaheadjs: {
                            valueKey: 'value',
                            source: function(query, process) {
                                $.getJSON(remoteUrl, {
                                        q: query
                                    },
                                    function(data) {
                                        process(data);
                                    });
                            }
                        }
                    });
                } else {
                    $(el).tagsinput();
                }
            });
    }
    self.dragsort = function(el, opts) {
        seajs.use(['/assets/js/kaka/libs/dragsort/jquery.dragsort-0.5.2.js'],
            function(dragsort) {
                $(el).dragsort({
                    dragSelectorExclude: "input, textarea, select, a, button",
                    dragSelector: 'tr',
                });
            });
    }
    self.chart = function(el, opts) {
        seajs.use(['/assets/js/kaka/libs/highcharts/highcharts.js'],
            function() {
                var defaults = {
                    title: {
                        text: false
                    },
                    chart: {},
                    legend: {},
                    credits: {
                        enabled: false
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                    }
                };
                opts = $.extend(true, defaults, opts);
                if ($(el).attr('id')) {
                    var obj = $(el).attr('id');
                } else {
                    var obj = 'charts-' + $(el).index();
                    $(el).attr('id', obj);
                }
                if (opts.series && opts.series.length == 1) {}
                Highcharts.chart(obj, opts);
            });
    }
    self.peity = function(el, opts) {
        seajs.use(['/assets/js/kaka/libs/peity/peity.min.js'],
            function() {
                var defaults = {
                    width: $(el).css('width'),
                    height: $(el).css('height'),
                }
                opts = $.extend(true, defaults, opts);
                $(el).peity(opts.type, opts);
            });
    }
    self.dmenu = function(el, opts) {
        seajs.use(['/assets/js/kaka/libs/kaka.dmenu.js'],
            function() {
                var className = 'js-kaka-dmenu-' + $(el).index();
                $(el).hide().after('<div class="' + className + ' form-inline"></div>');
                if (opts.rows) {
                    var tpl = '<select size="' + (opts.rows) + '" class="form-control" style="margin-right:8px; width:200px"></select>';
                } else {
                    var tpl = '<select class="form-control form-control-select" style="margin-right:8px; width:200px"></select>';
                }
                var defaults = {
                    htmlTpl: tpl,
                    script: opts.srv,
                    selected: $(opts.iptDom).val(),
                    firstText: opts.deftext ? opts.deftext: '主分类',
                    callback: function(el, data) {
                        $(el).val(data.id > 0 ? data.id: 0);
                        var path = new Array();
                        $('.' + className + '>select').each(function() {
                            path.push($('option:selected', this).text());
                        });
                        $(opts.textDom).val(path.join(' > '));
                        $(opts.iptDom).val(data.id);
                    }
                }
                opts = $.extend(true, defaults, opts);
                new kakaDmenu('.' + className, opts);
            });
    }
    self.slider = function(el, opts) {
        seajs.use(['/assets/js/kaka/libs/slider/bxslider.min.js'],
            function() {
                var defaults = {
                    'controls': false,
                    'pager': false,
                    'auto': true,
                }
                opts = $.extend(true, defaults, opts);
                if (opts.min) {
                    opts.minSlides = opts.min;
                }
                if (opts.max) {
                    opts.maxSlides = opts.max;
                }
                if (opts.move) {
                    opts.moveSlides = opts.move;
                }
                return $(el).bxSlider(opts);
            });
    }
    self.explorer = function(el, opts) {
        seajs.use(['/assets/js/kaka/libs/kaka.explorer.js?v=1.0.1'],
            function() {
                return new kakaExplorer(el, opts);
            });
    }
    self.init('body');
    return self;
}
var kaka = new kaka();
window.kaka = kaka;

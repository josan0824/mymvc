var dialogEditorTemplate = '<div class="text-box">'+
        '<div class="inp-box">'+
            '<div contenteditable="true" class="inp" placeholder="请输入..." :maxlength="maxTextNum" id="textbox">'+
            '</div>'+
            '<div style="display:none" id="cachebox"></div>'+
        '</div>'+
        '<div class="text-foot">'+
            '<div class="left"><a href="javascript:void(0)" class="js-face-btn"></a></div>'+
            '<div class="right">还可输入<span>{{maxTextNum}}</span>字,按Enter键换行</div>'+
        '</div>'+
    '</div>';
Vue.component('dialog-editor', {
    template: dialogEditorTemplate,
    props: {
        'initData': { // 编辑传进来的数据，可选
            type: Object,
            default: ''
        },
        'maxTextNum': {
            default: 1000
        }
    },
    data: function() {
        return {
        }
    },
    created: function() {
    },
    mounted: function() {
        this.init()
        $(".text-box .js-face-btn").myFace({
            content: '.text-box',
            input: '.text-box .inp',
            clickHide: true
        });
        //字数限制
        $("#textbox").on("input paste", function () {
            if ($(this).attr("maxlength") - $(this).text().length <= 0){
                $(this).parent().next().find("span").text(0);
                $(this).text($(this).text().substring(0,$(this).attr("maxlength")));
            }else{
                $(this).parent().next().find("span").text($(this).attr("maxlength") - $(this).text().length);
            }
        });
    },
    methods: {
        init: function(){
            if(this.initData){
                $('#textbox').html(this.replaceImg(this.initData));
            }else{
                $('#textbox').html('');
            }
        },
        getTextData: function() { // 返回文字内容
            $('#cachebox').html($('#textbox').html());
            $('#cachebox').find('img').each(function(){
                var name = $(this).attr("data-name");
                $(this).before(name);
                $(this).remove();
            });
            return $('#cachebox').text().replace(/<[^<>]+>/g, "");
        },
        resetText: function() { // 清除内容
            $('#textbox').html('');
        },
        replaceImg: function (data) { // 转换为表情图片
            return ReplaceImg(data)
        },
    },
    watch: {
        initData: function(newData, oldData) {
            console.log(newData, oldData)
            this.init()
        }
    },
    computed: {
    }
})
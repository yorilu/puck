define(["backbone","text!../templates/feedback.tpl.html","puck","modelFactory","utils"],function(e,t,n,r,i){var s=r.get("addFeedback"),o=e.View.extend({events:{"click .js_back":"goBack","click .js_submit":"submit","input #txt_content":"change"},goBack:function(){n.back()},change:function(e){$dom=$(e.currentTarget);var t=this.$el.find(".js_submit");this.$el.find("#js_count").html($dom.val().length),$.trim($dom.val())!=""&&!t.hasClass("tink")?t.addClass("tink"):$.trim($dom.val())==""&&t.hasClass("tink")&&t.removeClass("tink")},submit:function(){if(!this.validate())return;if($.trim($("#txt_content").val())=="SmartCourt_RD"){alert("隐藏场馆已开启"),i.Store.set("SMART_HIDE_MODE",!0),n.back();return}s.$post({data:{clientID:"h5",mobileNumber:this.$el.find("#txt_mobile").val(),QQ:this.$el.find("#txt_qq").val(),content:$.trim($("#txt_content").val())},success:function(e){e.code==0&&(alert("反馈提交成功"),n.back())},error:function(){}})},validate:function(){return this.$el.find(".js_submit").hasClass("tink")?$.trim($("#txt_content").val())?$.trim(this.$el.find("#txt_qq").val())!=""&&!/^[1-9]\d{4,}$/.test(this.$el.find("#txt_qq").val())?(alert("QQ号码格式不正确！"),!1):$.trim(this.$el.find("#txt_mobile").val())!=""&&!/^(1[1-9][0-9])\d{8}$/.test(this.$el.find("#txt_mobile").val())?(alert("手机号码不正确！"),!1):!0:(alert("反馈内容不能为空！"),!1):!1},onInit:function(){},onShow:function(){this.$el.html(t)},onHide:function(){}});return o})
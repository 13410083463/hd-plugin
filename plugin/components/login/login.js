Component({
    data:{

    },
    ready(){
      
    },
    methods:{
      loginSuccess:function(res){
        var _this = this;
        _this.triggerEvent('loginSuccess',res)
      },
    }
})
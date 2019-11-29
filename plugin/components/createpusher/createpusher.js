const util = require('../../util.js');

Component({
  data:{
    imgUrl:'',
    path:""
  },
  ready(){

  },
  methods:{
    onTapChild(){
      this.triggerEvent('parentEvent', 2)
    }
  }

})
<template>
    <div id="userLogin">
        <div class="fn">
            <a href="https://www.lanniao.com" class="pictrue"><img src="../../assets/img/lanniaoyun.png" alt=""></a>
            <div class="content">
                    <div class="logBox">
                        <p>预约体验</p>
                        <div class="warning">
                            <div class="warningOne" v-if="nullValue"><img src="../../assets/img/prompt1.svg" alt=""><span>带红星的为必填项</span></div>
                        </div>
                        <el-form  ref="form" :model="form" label-width="80px" size="medium">
                            <div class="oneLine">
                                <div class="company"><span>*</span><span>公司名称：</span></div>                               
                                <div class="companyInput"><el-input v-model="form.company" placeholder="请输入"></el-input></div> 
                            </div>
                            <div class="twoLine">
                                <div class="positioning"><span>*</span><span>人员规模：</span></div>   
                                <div class="scale">
                                    <el-select v-model="value" placeholder="请选择" style="width: 281px;">
                                        <el-option :label= i.showPerson :value= i.showEnglish v-for="(i,k) in list" :key="k"></el-option>
                                    </el-select>
                                </div> 
                            </div> 
                            <div class="theLine">
                                <div class="name"><span>*</span><span>姓名：</span></div>
                                <div class="nameInput"><el-input v-model="form.name" placeholder="请输入"></el-input></div>
                            </div>   
                            <div class="forLine">
                                <div class="personnel"><span>*</span><span>您的职位：</span></div>
                                <div class="personnelInput">
                                    <el-select v-model="valueOne" placeholder="请选择" style="width: 281px;">
                                        <el-option :label= i.position :value= i.positionEnglish v-for="(i,k) in listTwo" :key="k"></el-option>
                                    </el-select>
                                </div> 
                            </div>    
                            <div class="errorPhone" v-if="errorPhone"><img src="../../assets/img/prompt1.svg" alt=""><span>请输入正确手机号</span></div>
                            <div class="fivLine">
                                <div class="pnone"><span>*</span><span>手机号码：</span></div>
                                <div class="pnoneInput"><el-input v-model="form.phone" placeholder="请输入" maxlength="11"></el-input></div>
                            </div>  
                            <div class="errorPhone" v-if="errorEmail"><img src="../../assets/img/prompt1.svg" alt=""><span>请输入有效邮箱</span></div>  
                            <div class="sixLine">
                                <div class="sixemail"><span>*</span><span>工作邮箱：</span></div>
                                <div class="pnoneInput"><el-input v-model="form.email" placeholder="请输入"></el-input></div>
                            </div>        
                        </el-form>
                        <div class="conform" @click="conform(value,valueOne)"><p>预约</p></div>
                        <div class="logfooter"><router-link to="/" class="click">返回登录</router-link></div>
                    </div>
                </div>
                <footer class="footer">
                <p>
                    <span class="companyThat">© 2018 北京蓝鸟云科技有限公司 All Rights Reserved</span>
                    <span class="interval"></span><img src="../../assets/img/gonganju.png" alt="">
                    <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502037467" style="color:#fff;">京公网安备11010502037467号</a>
                    <span class="interval"></span><a href="http://www.miitbeian.gov.cn/state/outPortal/loginPortal.action">京ICP备18064398号-2</a>
                </p>
            </footer>
        </div>
    </div>
</template>
<script>
export default {
    name: 'userLogin',
    data() {
        return {
            form: {
                company: '',
                name: '',
                phone: '',
                email: ''
            },
            value: '',
            valueOne: '',
            list: [{showPerson:'0-50人',showEnglish:'A'},{showPerson:'51-100人',showEnglish:'B'},{showPerson:'101-200人',showEnglish:'C'},{showPerson:'201-500人',showEnglish:'D'},{showPerson:'500人以上',showEnglish:'E'}],
            listTwo: [{position:'财务',positionEnglish:'fi'},{position:'人事行政',positionEnglish:'hr'},{position:'运营',positionEnglish:'op'},{position:'IT',positionEnglish:'it'},{position:'其他',positionEnglish:'ot'}],
            nullValue: 0,
            errorPhone: 0,
            errorEmail: 0
        }
    },
    methods:{
        conform(value,valueOne) {
            if(!this.form.company||!value||!valueOne||!this.form.name||!this.form.phone||!this.form.email){
                this.nullValue = 1
            }else{
                this.nullValue = 0
                if((parseFloat(this.form.phone).toString() == "NaN")||this.form.phone.length!=11){
                this.errorPhone = 1
                }else{
                    this.nullValue = 0
                    this.errorPhone = 0
                     let reg = /^[A-Za-z0-9_.\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                     if(!reg.test(this.form.email)){
                         this.errorEmail = 1
                         return
                     }else{
                         this.nullValue = 0
                         this.errorPhone = 0
                         this.errorEmail = 0
                         this.$axios({
                             method: 'post',
                             url: this.$urls.bespeakExam,
                             data: {
                                 companyName: this.form.company,
                                 workerSize: this.value,
                                 name: this.form.name,
                                 post: this.valueOne,
                                 phone: this.form.phone,
                                 email: this.form.email
                             }
                         }).then(res=>{
                             if(res.data.status == 200){
                                 this.$message({
                                    message: res.data.message,
                                    type: 'success',
                                    duration: 5 * 1000
                                    })
                                this.$router.push({name:'appointmentSuccess'})
                             }else{
                                 this.$message({
                                    message: res.data.message,
                                    type: 'error',
                                    duration: 5 * 1000
                                    })
                             }            
                         }).catch(err=>{

                         })
                     }
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
#userLogin{
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    background: #f4f8fc;
    // overflow: hidden;
    background: url('../../assets/img/beijing.png') no-repeat;
    background-size: 100% 100%;
    .fn{   
        width: 100%;
        height: 100%;
        position: relative;
        background: rgba(81, 88, 101, .5);
        .pictrue{
            display: inline-block;
            position: absolute;
            top: 0;
            left: 0;
            height: 60px;  
            width: 100%;    
            background: #ffffff;          
        img{
            width: 139px;
            height: 24px;
            margin-top: 19px;
            margin-left: 100px;
        }
      }
    .content{
        display: flex;
        justify-content: center;
        align-items: center;

        width: 100%;
        height: 100vh;      
            .logBox{
              position: relative;
              width: 500px;
              margin-top: 60px;
              padding-bottom: 30px;
              background: rgba(255, 255, 255, .92);
              box-shadow: 0px 0px 12px 5px rgba(6, 29, 65, 0.1);
              border-radius: 5px;
              p{
                  width: 88px;
	              height: 30px;
                  font-size: 22px;
                  color: #444950;
                  margin: 40px auto;
              }
              .warning{
                  display: flex;
                  margin-left: 52px;
                  margin-top: -6px;
                  margin-bottom: 5px;
                  .warningOne{
                      height: 17px;
                      img{
                          float: left;
                          width: 12px;
                          height: 12px;
                          margin-right: 5px;
                          margin-top: 2.5px;
                      }
                      span{
                          font-size: 12px;
                          color: #e45a3c;
                      }
                  }
              }
              .oneLine{
                  width: 400px;
                  height: 44px;
                  display: flex;
                  margin-left: 50px;
                  
                  justify-content: center;
                  .company{
                    width: 90px;
                    margin-top: 10px;
                  span:nth-child(1){
                      color: red;
                  }
                  span:nth-child(2){
                      font-size: 16px;                     
                  }
                }
              }
              
              .twoLine{
                  margin-left: 40px;
                  width: 400px;
                  height: 44px;
                  display: flex;
                  margin-top: 20px;
                  justify-content: center;
                  .positioning{
                    width: 90px;
                    margin-top: 10px;
                    span:nth-child(1){
                        color: red;
                    }
                    span:nth-child(2){
                        font-size: 16px;                     
                    }
                }
              }
              .theLine{
                  margin-left: 50px;
                  width: 400px;
                  height: 44px;
                  display: flex;
                  margin-top: 20px;
                  justify-content: center;
                  .name{
                    width: 90px;
                    margin-top: 10px;
                    span:nth-child(1){
                        color: red;
                    }
                    span:nth-child(2){
                        font-size: 16px;                     
                    }
                }
              }
              .forLine{
                  margin-left: 40px;
                  width: 400px;
                  height: 44px;
                  display: flex;
                  margin-top: 20px;
                  justify-content: center;
                  .personnel{
                    width: 90px;
                    margin-top: 10px;
                    span:nth-child(1){
                        color: red;
                    }
                    span:nth-child(2){
                        font-size: 16px;                     
                    }
                }
              }
              .errorPhone{
                  float: left;
                  margin-top: 10px;
                  margin-bottom: 10px;
                  margin-left: 150px;
                  height: 17px;
                      img{
                          float: left;
                          width: 12px;
                          height: 12px;
                          margin-right: 5px;
                          margin-top: 2.5px;
                      }
                      span{
                          font-size: 12px;
                          color: #e45a3c;
                      }
              }
              .fivLine{
                  margin-left: 50px;
                  width: 400px;
                  height: 44px;
                  display: flex;
                  margin-top: 20px;
                  justify-content: center;
                  .pnone{
                    width: 90px;
                    margin-top: 10px;
                    span:nth-child(1){
                        color: red;
                    }
                    span:nth-child(2){
                        font-size: 16px;                     
                    }
                }
              }
              .sixLine{
                  margin-left: 50px;
                  width: 400px;
                  height: 44px;
                  display: flex;
                  margin-top: 20px;
                  justify-content: center;
                  .sixemail{
                    width: 90px;
                    margin-top: 10px;
                    span:nth-child(1){
                        color: red;
                    }
                    span:nth-child(2){
                        font-size: 16px;                     
                    }
                }
              }
              .conform{
                  width: 400px;
                  height: 44px;
                  margin: -20px auto;                 
                  border-radius: 22px;
                  line-height: 44px;
                  text-align: center;
                  background-color: #4c8aff;
                  cursor: pointer;
                  p{
                      font-size: 16px;
                      color: #ffffff;
                  }
              }
              .logfooter{
                  height: 44px;
                  display: flex;
                  margin-top: 15px;
                  justify-content: space-around;
                  .click{
                      margin: 12px auto;
                      font-size: 14px;
                      color: #666666;
                      &:hover{
                          color: #4c8aff;
                      }
                  }
              }
              
            }
          }  
          .footer{
            width: 100%;
            height: 22px;
            position: absolute;
            bottom: 15px;
            p{
                width: 100%;
                height: 22px;
                text-align: center;
                color: #ffffff;
                font-size: 16px;
                margin-top: 0px;
                .companyThat,a{
                    font-size: 12px;
                    color: #ffffff;
                    font-family: 'PingFangSC-Medium';
                }
                .interval{
                    display: inline-block;
                    width: 1px;
                    height: 13px;
                    margin: -1px 10px;
                    background: #fff;
                }
                img{
                    width: 14px;
                    height: 13px;
                    margin-left: 2px;
                    margin-right: 3px;
                }
                a:nth-of-type(1){
                    position: relative;
                    &::after{
                        position: absolute;
                        top: 17px;
                        left: 0;
                        content: '';
                        display: none;
                        width: 165px;
                        height: 1px;
                        background: #fff;
                    }
                    &:hover::after{
                        display: inline-block;
                    }
                }
                a:nth-of-type(2){
                    position: relative;
                    &::after{
                        position: absolute;
                        top: 17px;
                        left: 0;
                        content: '';
                        display: none;
                        width: 125px;
                        height: 1px;
                        background: #fff;
                    }
                    &:hover::after{
                        display: inline-block;
                    }
                }
            }
        }    
    }   
}
</style>



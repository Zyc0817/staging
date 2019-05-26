<template>
    <div id="userLogin">   
        <div class="fn">
            <a href="https://www.lanniao.com" class="pictrue"><img src="../../assets/img/lanniaoyun.png" alt=""></a>
            <div class="content">
                    <div class="logBox">
                        <p>找回密码</p>
                        <div class="icon">
                            <div class="promptOne" v-if="emailVerificationCode"><img src="../../assets/img/prompt1.svg" alt=""><span>请输入邮箱和验证码</span></div>
                            <div class="promptOne" v-if="correctEmail"><img src="../../assets/img/prompt1.svg" alt=""><span>请输入正确邮箱</span></div>
                            <div class="promptOne" v-if="haveMail"><img src="../../assets/img/prompt1.svg" alt=""><span>请输入邮箱</span></div>
                            <div class="promptOne" v-if="correctVerification"><img src="../../assets/img/prompt1.svg" alt=""><span>验证码错误</span></div>
                        </div>
                        <el-form ref="form" :model="form" label-width="80px" size="medium">
                            <div class="emailOne">
                                <el-input v-model="form.email" placeholder="邮箱账号" @@keyup.tab.native="checkEmail(form.email)" @input="checkWrite"></el-input>
                                <img src="../../assets/img/youxiang.svg" alt="">
                            </div>
                            <div class="passwordOne">
                                <el-input type="text" v-model="form.verificationCode" placeholder="验证码" @input="checkWrite" @keyup.enter.native="handleSubmit(form.email,form.verificationCode)" @focus="checkEmail(form.email)"></el-input>
                                <img src="../../assets/img/yanzhengmatianchong.svg" alt="">
                                <div class="verificationCode"><span class="line"></span><span class="verification" @click="verification"><img :src="letter" alt="" :style="{width:'75px',height: '30px'}"></span></div>  
                            </div>
                            <div class="company" v-if="list.length>1">
                                <el-select v-model="value" placeholder="公司" @change="handleSubmit(form.email,form.verificationCode,value)">
                                    <el-option :label= i.name :value= i.id v-for="(i,k) in list" :key="k"></el-option>
                                </el-select>
                                <img src="../../assets/img/gongsi.svg" alt="">
                            </div>
                        </el-form>
                        <div class="logBodyThe">
                            <div class="conform" @click="nextStep(form.email,form.verificationCode)"><p>下一步</p></div> 
                            <div class="logfooter">
                                <p>记起密码，直接 <router-link to="/" class="click">登录</router-link></p>       
                            </div>
                        </div>                    
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
               email: '',
               verificationCode: '',
            },
            letter: '',
            correctEmail: 0,
            emailVerificationCode: 0,
            correctVerification: 0,
            haveMail: 0,
            chooseCompany: 0,
            value: '',
            list: [],
            k:0
        }
    },
    created() {
        this.verification()
    },
    methods:{
        handleSubmit(email,password,value) {
            this.nextStep(email,password,value)
        },
        verification() {
            this.letter = this.$baseApi + this.$urls.getImage+ '?ttt=' + new Date().getTime()
        },
        checkEmail(item) {
            let reg = /^[A-Za-z0-9_.\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if(!item){ 
                this.haveMail=1
                this.k=0
                return 
            }
            if(!reg.test(item)){
                this.correctEmail=1
                this.k=0
                return
            }else{
                this.$axios({
                    method: 'get',
                    url: this.$urls.hotels,
                    params:{ account: item}
                }).then(res=>{
                    if(res.data.length!=0){
                        this.list = res.data
                    }else{
                        this.k=1
                        this.$message({
                            message: '该账号不存在',
                            type: 'error',
                            duration: 5*1000
                        })
                    }
                })
            }   
        },
        nextStep(email,verificationCode) {
            if(this.k==1){
                this.$message({
                    message: '该账号不存在',
                    type: 'error',
                    duration: 5*1000
                })
                return
            }
            let reg = /^[A-Za-z0-9_.\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if(email){
                if(!reg.test(email)){
                    this.correctEmail = 1
                    return
                }
            }else{ return this.haveMail=1 }
            if(!verificationCode){
                this.correctVerification=1
                return
            }
            this.$axios({
                method: 'post',
                url: this.$urls.captcha,
                data: {
                    username: this.form.email,
                    captcha: this.form.verificationCode,
                    hotalId: this.list.length>1?this.value:this.list[0].id
                }
            }).then(res=>{
                if(res.data.message == '成功'){
                    this.$message({
                        message: '验证成功',
                        type: 'success',
                        duration: 3*1000
                    })
                    setTimeout(_=>{
                        this.$router.push({path: '/retrievePasswordConfirm'})
                    },300)
                }else{
                    this.haveMail = 0
                    this.correctEmail = 0
                    this.correctVerification = 1
                    this.emailVerificationCode = 0
                    this.verification()
                }
            }).catch(err=>{}) 
        },
        checkWrite() {
            this.k=0
            this.haveMail = 0
            this.correctEmail = 0
            this.emailVerificationCode = 0
            this.correctVerification = 0
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
    background: url('../../assets/img/beijing.png') no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    .fn{      
        position: relative;     
        width: 100%;
        height: 100vh;
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
        height: 100%;      
            .logBox{          
              width: 500px;
              position: relative;
              margin-top: 60px;
              background: rgba(255, 255, 255, .92);
              box-shadow: 0px 0px 12px 5px rgba(6, 29, 65, 0.1);
              border-radius: 5px;
              .icon{
                  display: flex;
                  margin-left: 70px;
                  margin-top: -6px;
                  margin-bottom: 5px;
                  z-index: 99;
                    .promptOne{
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
              p{
                  width: 88px;
	              height: 30px;
                  font-size: 22px;
                  color: #444950;
                  margin: 40px auto;
              }
              .emailOne{
                  position: relative;
                  margin-top: -10px;
                  img{
                      position: absolute;
                      top: 25px;
                      left: 70px;
                  }
              }
              .passwordOne{
                  position: relative;
                  img{
                      position: absolute;
                      top: 31px;
                      left: 72.5px;
                  }
                  .verificationCode{                      
                      top: 30px;
                      left: 343px;
                      display: flex;
                      position: absolute;
                      .line{  
                          width: .5px;
                          height: 24px;
                          background: #ececec;
                          display: inline-block;
                      }
                      .verification{     
                          width: 75px;
                          height: 30px;
                          margin-top: -3.5px;
                          margin-left: 10px;
                          line-height: 30px;
                          text-align: center;
                          display: inline-block;
                          background: #d8d8d8;
                          cursor: pointer;
                          img{
                              margin-left: -63px;
                              margin-top: -35px;
                          }
                      }
                  }
              }
              .company{
                  position: relative;
                  width: 400px;
                  margin-left: 50px;
                  img{
                      position: absolute;
                      top: 31px;
                      left: 21px;
                  }
              }
              .logBodyThe{
                  position: relative;
                  .inputOne{                                  
                    width: 310px;
                    height: 44px;
                    margin-left: 50px;
                    margin-top: 20px;
                    background-color: #ffffff;
                    border-radius: 22px;
                    border: solid 1px #ececec;
                    outline: none;
                    padding-left: 90px;
                  }
                  .email{
                      width: 66px;
                      height: 20px;
                      position: absolute;
                      top: 11px;
                      left: 70px;
                      .emailLitter{
                          width: 32px;
                          font-size: 16px;
                          color: #999999;
                          margin-left: 10px;
                      }
                  }
                  .triangle{
                      position: absolute;
                      left: 418px;
                      top: 29px;
                  }
              }
              .conform{
                  width: 400px;
                  height: 44px;
                  margin: -23px auto;                 
                  border-radius: 22px;
                  line-height: 44px;
                  text-align: center;
                  cursor: pointer;
                  background-color: #4c8aff;
                  p{
                      font-size: 16px;
                      color: #ffffff;
                  }
              }
              .logfooter{
                  display: flex;
                  margin-top: 20px;
                  justify-content: space-around;
                  p{
                      width: 140px;
                      height: 20px;
                      margin-top: 10px;
                      font-size: 14px;
                      color: #999999;
                  }
                  .click{
                      position: relative;
                      margin-top: 30px;
                      font-size: 14px;
                      color: #4c8aff;
                      &:hover:after{
                          position: absolute;
                          top: 20.1px;
                          left: 0;
                          content: '';
                          width: 27px;
                          height: .5px;
                          background: #4c8aff;
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



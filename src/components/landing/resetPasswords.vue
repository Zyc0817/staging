<template>
    <div id="userLogin">   
        <div class="content">
            <a href="https://www.lanniao.com" class="pictrue"><img src="../../assets/img/lanniaoyun.png" alt=""></a>
            <div class="login">
                <div class="fn">
                    <div class="logBox">
                        <p>重置密码</p>
                        <el-form ref="form" :model="form" label-width="80px" size="medium">
                            <div class="emailOne">
                                <el-input type="password" v-model="form.password" placeholder="新密码"></el-input>
                                <img src="../../assets/img/mima.svg" alt="">
                                <div class="prompts"><span>密码至少由8个字符组成，必须包含数字、字母，区分大小写</span></div>
                            </div>
                            <div class="passwordTwo">
                                <el-input type="password" v-model="form.passwordOne" placeholder="确认密码"></el-input>
                                <img src="../../assets/img/mima.svg" alt="">
                                <div class="prompt"><span>请再次输入密码</span></div>  
                            </div>
                        </el-form>
                        <div class="logBodyThe">
                            <div class="conform" @click="submit(form.password,form.passwordOne)"><p>提交</p></div> 
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
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'userLogin',
    data() {
        return {
            form: {
               password: '',
               passwordOne: ''
            },
            letter: ''
        }
    },
    methods:{
        submit(password,passwordOne) {
            console.log(password,passwordOne)
            if(password&&passwordOne){
                if(password!=passwordOne){
                    this.$message({
                        message: "两次输入密码不一致",
                        type: 'error',
                        duration: 5 * 1000
                     })
                }else{
                    this.$axios({
                        method: 'post',
                        url: this.$urls.findPwd,
                        data: {}
                    }).then(res=>{
                        console.log(res)
                        this.$router.push({path: '/retrievePasswordConfirm'})
                    }).catch(err=>{
                        console.log(err)
                    })
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
    overflow: hidden;
    .content{
        width: 100%;
        height: 100%;      
        background: url('../../assets/img/beijing.png') no-repeat;
        background-size: 100% 100%;
        .pictrue{
            display: inline-block;
            height: 60px;      
            background: #ffffff;          
            img{
                width: 139px;
                height: 24px;
                margin-top: 19px;
                margin-left: 100px;
            }
        }
      .login{        
          height: 100%;
          .fn{           
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            background: rgba(81, 88, 101, .5);
            .logBox{          
              width: 500px;
              height: 366px;
              position: relative;
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
              .emailOne{
                  position: relative;
                  img{
                      position: absolute;
                      top: 20px;
                      left: 70px;
                  }
                  .prompts{
                      margin-top: 10px;
                      margin-left: 73px; 
                      span{
                          font-size: 12px;
                          color: #999999;
                      } 
                  }
              }
              .passwordTwo{
                  position: relative;
                  img{
                      position: absolute;
                      top: 21px;
                      left: 72.5px;
                  }
                  .prompt{  
                      margin-top: 10px;
                      margin-left: 73px; 
                      span{
                          font-size: 12px;
                          color: #999999;
                      }                   
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
      }
    }   
}
</style>


